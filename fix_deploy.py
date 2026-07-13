import os, shutil

root = "C:/Users/maula/Downloads/ABDM/_Agent_Manager/_Agent Free/Modul"
os.makedirs(f"{root}/frontend/api", exist_ok=True)

shutil.copy2(f"{root}/api/index.py", f"{root}/frontend/api/index.py")
shutil.copy2(f"{root}/api/requirements.txt", f"{root}/frontend/api/requirements.txt")

vc = '{\n  "buildCommand": "tsc && vite build",\n  "outputDirectory": "dist",\n  "rewrites": [\n    {"source": "/api/(.*)", "destination": "/api/index"},\n    {"source": "/(.*)", "destination": "/index.html"}\n  ]\n}'
with open(f"{root}/frontend/vercel.json", "w") as f:
    f.write(vc)

for path in ["frontend/api/index.py", "frontend/api/requirements.txt", "frontend/vercel.json"]:
    print(f"{path}: {os.path.exists(os.path.join(root, path))}")
