# run_service.py
import uvicorn
from barcode_service import app  # Directly import the app object

if __name__ == "__main__":
    uvicorn.run(app,
                 host="127.0.0.1", 
                 port=5001, 
                 reload=False,
                 log_config=None)
