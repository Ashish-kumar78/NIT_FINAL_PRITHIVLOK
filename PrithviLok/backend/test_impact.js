import fs from 'fs';
import path from 'path';

async function testImpact() {
  try {
    const formData = new FormData();
    // we need to pass a mock file object in node fetch
    const fileBlob = new Blob(['mock image data'], { type: 'image/jpeg' });
    formData.append('image', fileBlob, 'test.jpg');
    formData.append('weight', '0.5');

    const response = await fetch('http://localhost:5000/api/impact/scan', {
      method: 'POST',
      body: formData,
    });
    
    console.log('Status:', response.status);
    const text = await response.text();
    console.log('Body:', text);
  } catch (error) {
    console.error('Fetch Failed:', error);
  }
}

testImpact();
