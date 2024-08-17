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