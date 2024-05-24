import React from 'react';
import './Legend.css';

const Legend = () => {
  return (
    <div className="legend">
      <h4>Alzheimer's Incidence Rate</h4>
      <div><i style={{ background: '#800026' }}></i> &gt; 10.5%</div>
      <div><i style={{ background: '#BD0026' }}></i> 10% - 10.5%</div>
      <div><i style={{ background: '#E31A1C' }}></i> 9.5% - 10%</div>
      <div><i style={{ background: '#FC4E2A' }}></i> 9% - 9.5%</div>
      <div><i style={{ background: '#FD8D3C' }}></i> 8.5% - 9%</div>
      <div><i style={{ background: '#FEB24C' }}></i> 8% - 8.5%</div>
      <div><i style={{ background: '#FFEDA0' }}></i> &lt; 8%</div>
    </div>
  );
};

export default Legend;
