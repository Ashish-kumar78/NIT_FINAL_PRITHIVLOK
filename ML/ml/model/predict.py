import sys
import os
import pickle
import warnings

# Suppress sklearn warnings so it doesn't break Node.js stdout parsing
warnings.filterwarnings("ignore", category=UserWarning)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load models using absolute paths
with open(os.path.join(BASE_DIR, "energy_model.pkl"), "rb") as f:
    model_energy = pickle.load(f)

with open(os.path.join(BASE_DIR, "cost_model.pkl"), "rb") as f:
    model_cost = pickle.load(f)

# Mapping
mapping = {
    "plastic": 1,
    "metal": 2,
    "paper": 3,
    "glass": 4
}

# Get input
material = sys.argv[1]
weight = float(sys.argv[2])

material_num = mapping.get(material, 1)

# Predict
energy = model_energy.predict([[material_num, weight]])[0]
cost = model_cost.predict([[material_num, weight]])[0]

# Output
print(f"{round(energy,3)},{round(cost,2)}")