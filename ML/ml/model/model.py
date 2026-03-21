import os
import pandas as pd
from sklearn.linear_model import LinearRegression
import pickle

# -------------------------------
# 📊 Load CSV data
# -------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data.csv")
if not os.path.exists(DATA_PATH):
    DATA_PATH = os.path.join(BASE_DIR, "..", "data", "data.csv")
df = pd.read_csv(DATA_PATH)

# -------------------------------
# 🔢 Convert material to numbers
# -------------------------------
mapping = {
    "plastic": 1,
    "metal": 2,
    "paper": 3,
    "glass": 4
}

df["material"] = df["material"].map(mapping)

# -------------------------------
# 🧠 Input (X) and Output (y)
# -------------------------------
X = df[["material", "weight"]]
y_energy = df["energy"]
y_cost = df["cost"]

# -------------------------------
# 🤖 Train Models
# -------------------------------
model_energy = LinearRegression()
model_cost = LinearRegression()

model_energy.fit(X, y_energy)
model_cost.fit(X, y_cost)

# -------------------------------
# 💾 Save Models
# -------------------------------
with open(os.path.join(BASE_DIR, "energy_model.pkl"), "wb") as f:
    pickle.dump(model_energy, f)

with open(os.path.join(BASE_DIR, "cost_model.pkl"), "wb") as f:
    pickle.dump(model_cost, f)

print("✅ Models trained and saved!")

# -------------------------------
# 🧪 Test Prediction
# -------------------------------
test_input = pd.DataFrame([[1, 0.5]], columns=["material", "weight"])  # plastic, 0.5kg

energy = model_energy.predict(test_input)
cost = model_cost.predict(test_input)

print("🔋 Energy:", round(energy[0], 3), "kWh")
print("💰 Cost: ₹", round(cost[0], 2))