### ENVIRONMENT SETUP
1. Create environment folder in the root directory by running the following command in the terminal:
```bash
python -m venv env
```
2. Activate the virtual environment by running the following command in the terminal:

- *(for linux)*

```bash
source env/bin/activate
```

- *(for windows)*
```bash
.\env\Scripts\activate
```

3. Install the required python packages by running the following command in the terminal:
```bash
pip install -r requirements.txt
```


### NODE MODULES INSTALLATION
1. Navigate to the `frontend` directory by running the following command in the terminal:
```bash
cd frontend
```
2. Install the required node modules by running the following command in the terminal:
```bash
npm install axios react-router-dom jwt-decode
```
### CONNECT VITE TO DJANGO
1. Navigate to the `frontend` directory by running the following command in the terminal:
```bash
cd frontend
```
2. Create a `.env` file in the `frontend` directory and add the following line to it (if the backend is running on `http://localhost:8000`, else replace the URL with the backend URL):
```bash
VITE_API_URL=http://localhost:8000
```

### RUNNING THE APPLICATION
1. Start two terminals, one for the frontend and the other for the backend.
2. Navigate to the `frontend` directory in one terminal and run the following command:
```bash
npm run dev
```
3. Navigate to backend directory in the other terminal and run the following command:
```bash
python manage.py runserver
```
4. Open the browser on adress specified in frontend terminal 
 (For example: `http://localhost:5173/`)

### SUPERVISING DATABASE
1. Create a superuser by running the following command in the terminal:
```bash
python manage.py createsuperuser
```
2. Enter the required details and the superuser will be created.
3. Navigate to the admin page by running the following command in the terminal:
```bash
python manage.py runserver
```
4. Open the browser on `http://localhost:8000/admin/` and login with the superuser credentials.
5. You can now supervise the database by adding, updating or deleting the data.

