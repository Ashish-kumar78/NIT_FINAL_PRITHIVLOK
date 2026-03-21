import sys
import os
import pickle
import warnings

warnings.filterwarnings("ignore", category=UserWarning)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load models
with open(os.path.join(BASE_DIR, "energy_model.pkl"), "rb") as f:
    model_energy = pickle.load(f)

with open(os.path.join(BASE_DIR, "cost_model.pkl"), "rb") as f:
    model_cost = pickle.load(f)

mapping = {"plastic": 1, "metal": 2, "paper": 3, "glass": 4}

try:
    material = sys.argv[1]
except IndexError:
    material = "plastic"

try:
    weight = float(sys.argv[2])
except (IndexError, ValueError):
    weight = 0.5 

material_num = mapping.get(material, 1)

energy = model_energy.predict([[material_num, weight]])[0]
cost = model_cost.predict([[material_num, weight]])[0]

print(f"{round(energy,3)},{round(cost,2)}")