import requests

def test_health_check():
    response = requests.get("http://localhost:5001/health")
    assert response.status_code == 200
    #assert response.json["status"] == "OK"
    #assert response.json["database"] == "connected"
    
def test_register():
    response = requests.post("http://localhost:5001/api/auth/register", json={"email": "sai@example.com", "password": "password"})
    assert response.status_code == 201
    #assert response.json["email"] == "sai@example.com"
    
if __name__ == "__main__":
    test_health_check()
    test_register()

