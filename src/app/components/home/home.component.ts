import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ColorserviceService } from '../../services/colorservice.service';

@Component({
  selector: 'app-home',
  standalone: true, // 👈 Add this line
  imports: [CommonModule, RouterModule], // 👈 This makes ngFor and routing work
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private router: Router, private colorService: ColorserviceService) {}
selectedColor: string = ''; 
  ngOnInit() {
    this.colorService.selectedColor$.subscribe(color => {
      this.selectedColor = color;
    });
  }
  goToRegister() {
    this.router.navigate(['auth/signup']);
  }

  steps = [
    {
      number: 1,
      title: 'Sign Up',
      description: 'Create your free account as a Farmer or Buyer to access the AgriMandi platform.',
      image: 'Register.JPG'
    },
    {
      number: 2,
      title: 'List or Browse Products',
      description: 'Farmers can upload product details, while buyers explore available produce in real-time.',
      image: 'list.webp'
    },
    {
      number: 3,
      title: 'Connect & Communicate',
      description: 'Initiate direct chat or call between farmers and buyers for negotiation and clarity.',
      image: 'trade.jpeg'
    },
    {
      number: 4,
      title: 'Secure Transactions',
      description: 'Finalize deals and complete payments securely through integrated payment gateways.',
      image: 'trade.jpeg'
    },
    {
      number: 5,
      title: 'Track & Rate',
      description: 'Track your orders and leave feedback to build a trusted, transparent marketplace.',
      image: 'trade.jpeg'
    }
  ];

  impactStats = [
    { value: '10,000+', label: 'Farmers Empowered' },
    { value: '50,000+', label: 'Transactions Completed' },
    { value: '20+', label: 'States Covered' }
  ];

  blogs = [
    { id: 1, title: '5 Tips for Selling Produce Online', description: 'Learn how to optimize your listings and attract more buyers.', image: 'blog1.jpg' },
    { id: 2, title: 'The Future of Digital Agriculture', description: 'Discover how technology is shaping the agricultural industry.', image: 'blog2.jpg' }
  ];

  faqs = [
    { question: 'How do I register?', answer: 'Click the "Get Started" button and fill out the registration form to create an account.' },
    { question: 'Is there a fee for using AgriMandi?', answer: 'No, registering and using the platform is completely free for both farmers and buyers.' },
    { question: 'How are payments handled?', answer: 'Payments are securely processed directly between farmers and buyers via integrated payment systems.' }
  ];
}
