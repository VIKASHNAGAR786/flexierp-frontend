import {
  Component, AfterViewInit, ElementRef, ViewChild, Inject, PLATFORM_ID, Output, EventEmitter,
  HostListener, OnDestroy
} from '@angular/core';
import * as THREE from 'three';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ColorserviceService } from '../../services/colorservice.service';
// Import from 'three/examples/jsm/...'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

@Component({
  selector: 'app-wheel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wheel.component.html',
  styleUrls: ['./wheel.component.css']
})
export class WheelComponent implements AfterViewInit, OnDestroy {

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: KeyboardEvent) {
    this.showBigWheel = false;
  }

  @ViewChild('rendererContainer', { static: false }) rendererContainer!: ElementRef;
  @ViewChild('miniWheelContainer', { static: false }) miniWheelContainer!: ElementRef;
  @ViewChild('colorPicker', { static: false }) colorPickerRef!: ElementRef<HTMLInputElement>;

  @Output() colorSelected = new EventEmitter<string>();

  showBigWheel = false; // State: Controls modal display
  private colorPicker: HTMLInputElement;
  private platformBrowser: boolean;
  private outsideClickListener: any;
  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private meshes: THREE.Mesh[] = [];
  private raycaster: THREE.Raycaster | null = null;
  private mouse: THREE.Vector2 = new THREE.Vector2();

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private colorService: ColorserviceService) {
    this.platformBrowser = isPlatformBrowser(this.platformId);

    this.colorPicker = null!;
  }
  defaultColor: string = '#28a745';  // or any of the default 8 colors
  ngAfterViewInit(): void {
    if (!this.platformBrowser) return;

    // Emit and set default color
    this.colorSelected.emit(this.defaultColor);
    this.colorService.setColor(this.defaultColor);
    this.colorPicker = this.colorPickerRef?.nativeElement;
    this.initMiniWheel();
  }

  ngOnDestroy(): void {
    // Clean up Three.js resources and event listeners to avoid memory leaks
    this.disposeThreeResources();
    if (this.outsideClickListener) {
      document.removeEventListener('click', this.outsideClickListener);
    }
  }

  openColorWheel(): void {
    this.showBigWheel = true;

    setTimeout(() => {
      this.colorPicker = this.colorPickerRef?.nativeElement;

      if (this.colorPicker && !this.colorPicker.hasAttribute('data-listener-added')) {
        this.colorPicker.addEventListener('input', (event: Event) => {
          const color = (event.target as HTMLInputElement).value;
          this.colorSelected.emit(color);
          this.colorService.setColor(color);
          this.showBigWheel = false;
        });
        this.colorPicker.setAttribute('data-listener-added', 'true');
      }

      this.initBigWheel();
      this.addOutsideClickListener();
    }, 0);
  }

  private addOutsideClickListener() {
    this.outsideClickListener = (event: MouseEvent) => {
      const container = this.rendererContainer?.nativeElement;
      const colorPickerEl = this.colorPickerRef?.nativeElement;

      if (
        container &&
        colorPickerEl &&
        !container.contains(event.target as Node) &&
        !colorPickerEl.contains(event.target as Node)
      ) {
        colorPickerEl.style.visibility = 'hidden';
      }
    };

    document.addEventListener('click', this.outsideClickListener);
  }

  private initMiniWheel() {
    const container = this.miniWheelContainer.nativeElement;
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.z = 6;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(100, 100);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 0, 10);
    scene.add(ambientLight, directionalLight);

    // Wheel design (Only 8 colors)
    const radius = 2;
    const segments = 8;
    const colors = [
      '#4CAF50', // Fresh green (crops, leaves)
'#8BC34A', // Light green (saplings, grass)
'#CDDC39', // Lime yellow (sunlight on crops)
'#FFEB3B', // Sunflower yellow
'#FF9800', // Harvest orange (ripe grain, fruits)
'#A1887F', // Soil brown (earth)
'#795548', // Deep soil/bark (roots, wood)
'#3E2723'  // Dark brown (fertile ground)
    ];

    for (let i = 0; i < segments; i++) {
      const startAngle = (i / segments) * Math.PI * 2;
      const endAngle = ((i + 1) / segments) * Math.PI * 2;
      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.absarc(0, 0, radius, startAngle, endAngle, false);
      shape.lineTo(0, 0);

      const geometry = new THREE.ShapeGeometry(shape);
      geometry.computeVertexNormals();

      const material = new THREE.MeshStandardMaterial({
        color: colors[i],
        metalness: 0.5,
        roughness: 0.3,
        emissive: new THREE.Color(colors[i]),
        emissiveIntensity: 0.2,
        side: THREE.DoubleSide
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    }

    // Optional overlay: circular shine (semi-transparent white)
    const shineGeometry = new THREE.RingGeometry(radius * 0.95, radius, 64);
    const shineMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.05,
      side: THREE.DoubleSide
    });
    const shineMesh = new THREE.Mesh(shineGeometry, shineMaterial);
    scene.add(shineMesh);

    // Animate
    function animate() {
      requestAnimationFrame(animate);
      scene.rotation.z += 0.05;
      renderer.render(scene, camera);
    }
    animate();
  }

  //////////////// BIG WHEEL /////////////////////////

  private initBigWheel() {
    const container = this.rendererContainer.nativeElement;
    const width = container.clientWidth;
    const height = container.clientHeight;
    this.disposeThreeResources(); // Clean previous resources

    // Scene setup
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 6;
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Soft ambient light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5); // Main light
    directionalLight.position.set(3, 3, 5);
    directionalLight.castShadow = true; // Add shadows for realism
    this.scene.add(ambientLight, directionalLight);

    // Add a spotlight for a focused effect
    const spotlight = new THREE.SpotLight(0xffffff, 1, 10, Math.PI / 4, 0.5, 2);
    spotlight.position.set(0, 0, 5);
    spotlight.castShadow = true;
    this.scene.add(spotlight);

    // Wheel configuration
    const radius = 2.5;
    const segments = 8;
    const colors = [
      '#4CAF50', // Fresh green (crops, leaves)
      '#8BC34A', // Light green (saplings, grass)
      '#CDDC39', // Lime yellow (sunlight on crops)
      '#FFEB3B', // Sunflower yellow
      '#FF9800', // Harvest orange (ripe grain, fruits)
      '#A1887F', // Soil brown (earth)
      '#795548', // Deep soil/bark (roots, wood)
      '#3E2723'  // Dark brown (fertile ground)
    ];
    this.meshes = [];
    this.raycaster = new THREE.Raycaster();

    // Create wheel slices
    for (let i = 0; i < segments; i++) {
      const startAngle = (i / segments) * Math.PI * 2;
      const endAngle = ((i + 1) / segments) * Math.PI * 2;
      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.absarc(0, 0, radius, startAngle, endAngle, false);
      shape.lineTo(0, 0);

      const extrudeSettings = {
        depth: 0.3,
        bevelEnabled: true, // Add bevel for a more polished look
        bevelSize: 0.1,
        bevelSegments: 2,
      };
      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

      const material = new THREE.MeshStandardMaterial({
        color: colors[i],
        metalness: 0.6,  // Reflective effect using metalness
        roughness: 0.3,  // Surface smoothness
        emissive: new THREE.Color(colors[i]),
        emissiveIntensity: 0.3,  // Emissive intensity (works for MeshStandardMaterial)
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.userData = { colorIndex: i };
      this.meshes.push(mesh);
      this.scene.add(mesh);

      // Add a subtle glow to each slice
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: colors[i],
        opacity: 0.2,
        transparent: true,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
      });
      const glowMesh = new THREE.Mesh(geometry.clone(), glowMaterial);
      glowMesh.scale.multiplyScalar(1.1); // Slightly larger for glowing effect
      this.scene.add(glowMesh);

    }


    // Add glossy glass ring overlay
    const shineRing = new THREE.RingGeometry(radius * 0.9, radius, 64);
    const shineMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      opacity: 0.07,
      transparent: true,
      side: THREE.DoubleSide,
    });
    const shineMesh = new THREE.Mesh(shineRing, shineMaterial);
    this.scene.add(shineMesh);

    // Mouse interaction
    this.renderer.domElement.addEventListener('click', (event: MouseEvent) => {
      const rect = this.renderer!.domElement.getBoundingClientRect();
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      this.raycaster!.setFromCamera(this.mouse, this.camera!);
      const intersects = this.raycaster!.intersectObjects(this.meshes);

      if (intersects.length > 0) {
        const selected = intersects[0].object as THREE.Mesh;
        if (selected.material instanceof THREE.MeshStandardMaterial) {
          const currentColor = `#${selected.material.color.getHexString()}`;
          console.log('Selected color:', currentColor);  // Print the color in console
          this.colorSelected.emit(currentColor); // Emit the selected color
          this.colorService.setColor(currentColor);
          this.showBigWheel = false;  // Close the wheel

          // Optionally, add smooth color transition feedback or sound effects
          this.playClickSound();
          this.addGlowEffect(selected);
        }

      }
    });


    // Animate the wheel rotation and rendering
    const animate = () => {
      requestAnimationFrame(animate);
      this.scene!.rotation.z += 0.000; // Smooth slow spin
      this.renderer!.render(this.scene!, this.camera!);
    };
    animate();
  }

  // Play a subtle click sound when a color is selected (optional)
  private playClickSound() {
    const audio = new Audio('path_to_sound_effect.mp3'); // Add sound path
    audio.play();
  }

  // Add a glow effect to the selected color for emphasis
  private addGlowEffect(selected: THREE.Mesh) {
    const material = selected.material as THREE.MeshStandardMaterial;
    material.emissiveIntensity = 1.5;  // Increase the glow on selection
    setTimeout(() => {
      material.emissiveIntensity = 0.3;  // Reset the glow after a short delay
    }, 500);
  }

  private disposeThreeResources() {
    if (this.scene) {
      this.scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          object.material.dispose();
        }
      });
      this.scene = null;
    }

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }

    if (this.raycaster) {
      this.raycaster = null;
    }
  }
}
