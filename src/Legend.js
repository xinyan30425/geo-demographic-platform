import React from 'react';
import './Legend.css';

const Legend = () => {
  return (
    <div className="legend">
      <h4>Alzheimer's Incidence Rate</h4>
      <h4>for 65+</h4>
      {/* <h4>Percentage of Population </h4>  */}
      <div><i style={{ background: '#800026' }}></i> &gt; 10.5%</div>
      <div><i style={{ background: '#BD0026' }}></i> 10% - 10.5%</div>
      <div><i style={{ background: '#E31A1C' }}></i> 9% - 10%</div>
      <div><i style={{ background: '#FC4E2A' }}></i> 8% - 9%</div>
      <div><i style={{ background: '#FD8D3C' }}></i> 7% - 8%</div>
      <div><i style={{ background: '#FEB24C' }}></i> 6% - 7%</div>
      <div><i style={{ background: '#FFEDA0' }}></i> 5% - 6%</div>
      <div><i style={{ background: '#FFFAF0' }}></i> &lt; 5%</div>
      <div><i style={{ background: '#FFFFFF', border: '1px solid #000' }}></i> NA</div> {/* New entry for NA values */}
    </div>
  );
};

export default Legend;
