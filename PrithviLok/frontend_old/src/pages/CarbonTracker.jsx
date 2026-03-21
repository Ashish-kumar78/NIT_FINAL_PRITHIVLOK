import { useState } from 'react';
import { Leaf, Zap, Car, Utensils, AlertTriangle, CheckCircle, ShieldAlert, BarChart3 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import toast from 'react-hot-toast';

const TRAVEL_EMISSIONS = {
  car: 0.21,
  bike: 0.10,
  bus: 0.05,
  train: 0.04,
  walking: 0
};

const FOOD_EMISSIONS = {
  vegetarian: 2,
  mixed: 3,
  non_vegetarian: 5
};

const CarbonTracker = () => {
  const [distance, setDistance] = useState('');
  const [transportMode, setTransportMode] = useState('car');
  const [electricity, setElectricity] = useState('');
  const [foodHabit, setFoodHabit] = useState('vegetarian');
  
  const [results, setResults] = useState(null);

  const calculateImpact = () => {
    // Validation
    const distNum = parseFloat(distance);
    const elecNum = parseFloat(electricity);

    if (isNaN(distNum) || distNum < 0 || isNaN(elecNum) || elecNum < 0) {
      toast.error('Please enter valid positive numbers for distance and electricity.');
      return;
    }

    // Calculations
    const travelCarbon = distNum * TRAVEL_EMISSIONS[transportMode];
    const elecCarbon = elecNum * 0.82;
    const foodCarbon = FOOD_EMISSIONS[foodHabit];

    const totalCO2 = travelCarbon + elecCarbon + foodCarbon;
    const treesNeeded = totalCO2 / 21;
    const ecoScoreRaw = 100 - (totalCO2 * 2);
    const ecoScore = Math.max(0, Math.min(100, ecoScoreRaw));

    // Determine Status
    let statusText = '';
    let statusColor = '';
    let statusIcon = null;

    if (ecoScore >= 80) {
      statusText = 'Excellent 🌱';
      statusColor = '#22c55e'; // Green
      statusIcon = <CheckCircle size={24} color={statusColor} />;
    } else if (ecoScore >= 50) {
      statusText = 'Moderate ⚠️';
      statusColor = '#eab308'; // Yellow
      statusIcon = <AlertTriangle size={24} color={statusColor} />;
    } else {
      statusText = 'High Impact ❌';
      statusColor = '#ef4444'; // Red
      statusIcon = <ShieldAlert size={24} color={statusColor} />;
    }

    setResults({
      totalCO2: totalCO2.toFixed(2),
      treesNeeded: treesNeeded.toFixed(2),
      ecoScore: Math.round(ecoScore),
      statusText,
      statusColor,
      statusIcon,
      breakdown: [
        { name: 'Travel', value: parseFloat(travelCarbon.toFixed(2)), color: '#3b82f6' },
        { name: 'Electricity', value: parseFloat(elecCarbon.toFixed(2)), color: '#f59e0b' },
        { name: 'Food', value: parseFloat(foodCarbon.toFixed(2)), color: '#10b981' },
      ]
    });
    
    toast.success('Carbon footprint calculated successfully!');
  };

  return (
    <div style={{ paddingBottom: '40px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header Banner */}
      <div className="card-glass" style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.05))',
        border: '1px solid rgba(16, 185, 129, 0.3)', padding: '32px', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -100, right: -50, width: 300, height: 300, background: 'radial-gradient(circle, rgba(16,185,129,0.2), transparent 70%)', filter: 'blur(50px)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#fff', marginBottom: 8 }}>
            Carbon <span className="text-gradient">Footprint Tracker</span>
          </h1>
          <p style={{ fontSize: '15px', color: '#94A3B8', maxWidth: '600px', lineHeight: 1.6 }}>
            Understand your daily environmental impact. Calculate your CO₂ emissions, visualize your footprint, and see how many trees you need to offset your lifestyle.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
        
        {/* INPUT FORM CARD */}
        <div className="card-glass" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: 12, margin: 0 }}>
            <BarChart3 size={24} color="#10B981" /> Daily Activity Logger
          </h2>
          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '0' }} />

          {/* Travel Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label style={{ fontSize: '14px', fontWeight: 700, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Car size={16} color="#60A5FA" /> Travel
            </label>
            <div style={{ display: 'flex', gap: 12 }}>
              <input 
                type="number" 
                min="0"
                placeholder="Distance (km)" 
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '14px' }}
              />
              <select 
                value={transportMode}
                onChange={(e) => setTransportMode(e.target.value)}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '14px' }}
              >
                <option value="car">Car (Fuel)</option>
                <option value="bike">Motorbike</option>
                <option value="bus">Public Bus</option>
                <option value="train">Train</option>
                <option value="walking">Walking / Bicycle</option>
              </select>
            </div>
          </div>

          {/* Electricity Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label style={{ fontSize: '14px', fontWeight: 700, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Zap size={16} color="#FBBF24" /> Electricity Usage
            </label>
            <input 
              type="number" 
              min="0"
              placeholder="Units consumed (kWh)" 
              value={electricity}
              onChange={(e) => setElectricity(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '14px' }}
            />
          </div>

          {/* Food Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label style={{ fontSize: '14px', fontWeight: 700, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Utensils size={16} color="#10B981" /> Food Habits
            </label>
            <select 
              value={foodHabit}
              onChange={(e) => setFoodHabit(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '14px' }}
            >
              <option value="vegetarian">Vegetarian / Vegan</option>
              <option value="mixed">Mixed (Average Meat)</option>
              <option value="non_vegetarian">Heavy Non-Vegetarian</option>
            </select>
          </div>

          <button 
            onClick={calculateImpact}
            style={{ 
              marginTop: '12px', width: '100%', padding: '14px', borderRadius: '12px', 
              background: 'linear-gradient(90deg, #10B981, #059669)', color: '#fff', 
              fontSize: '15px', fontWeight: 800, border: 'none', cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)', transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Calculate Impact
          </button>
        </div>

        {/* RESULTS CARD */}
        <div className="card-glass" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', minHeight: '400px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: 0 }}>Impact Analysis</h2>
          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '0' }} />

          {!results ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, opacity: 0.5 }}>
               <BarChart3 size={48} color="#94A3B8" />
               <p style={{ color: '#94A3B8', fontSize: '14px' }}>Fill out the logger to see your carbon footprint analysis.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', animation: 'fadeIn 0.5s ease-out' }}>
              
              {/* Top Stats */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.4)', padding: '16px 20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800 }}>Carbon Footprint</span>
                    <div style={{ fontSize: '24px', fontWeight: 900, color: '#fff', marginTop: 4 }}>{results.totalCO2} <span style={{ fontSize: '14px', color: '#64748B' }}>kg CO₂</span></div>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800 }}>Trees Needed/Yr</span>
                    <div style={{ fontSize: '24px', fontWeight: 900, color: '#10B981', marginTop: 4 }}>{results.treesNeeded} <span style={{ fontSize: '18px' }}>🌳</span></div>
                  </div>
                </div>
              </div>

              {/* Eco Score & Progress Bar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#e2e8f0', fontWeight: 700 }}>Daily Eco Score</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {results.statusIcon}
                    <span style={{ fontSize: '16px', fontWeight: 800, color: results.statusColor }}>{results.statusText}</span>
                  </div>
                </div>
                
                {/* Custom Progress Bar */}
                <div style={{ position: 'relative', width: '100%', height: '16px', background: 'rgba(0,0,0,0.5)', borderRadius: '100px', overflow: 'hidden', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)' }}>
                  <div style={{ 
                    position: 'absolute', top: 0, left: 0, height: '100%', 
                    width: `${results.ecoScore}%`,
                    background: results.statusColor,
                    borderRadius: '100px',
                    transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: `0 0 10px ${results.statusColor}`
                  }} />
                </div>
                <div style={{ textAlign: 'right', fontSize: '12px', color: '#94a3b8', fontWeight: 700 }}>
                  {results.ecoScore} / 100
                </div>
              </div>

              {/* Chart Visualization */}
              <div style={{ height: '200px', width: '100%', position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={results.breakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {results.breakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
                 {results.breakdown.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                       <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color }} />
                       <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>{item.name}</span>
                    </div>
                 ))}
              </div>

            </div>
          )}
        </div>
      </div>
    {/* Global Keyframes for animations */}
    <style dangerouslySetInnerHTML={{__html: `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `}} />
    </div>
  );
};

export default CarbonTracker;
