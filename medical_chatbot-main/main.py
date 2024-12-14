import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "service.api:app_api",
        host="0.0.0.0",
        port=8080,
        reload=True,
        access_log=True)
    
