// Enhanced interactive chart functions for SEIDR
// Add to your existing JavaScript files

// Interactive Bar Chart with hover effects and click handlers
function drawInteractiveBars(svgId, items, title = '', onBarClick = null) {
    const svg = document.querySelector(svgId);
    svg.innerHTML = '';
    svg.style.cursor = 'default';
    
    const W = svg.clientWidth || 800;
    const H = svg.clientHeight || 320;
    const pad = 48;
    const bw = Math.min(60, (W - 2 * pad) / items.length - 10);
    const gap = 10;
    const maxVal = Math.max(1, ...items.map(x => x.val)) * 1.18;
  
    // Add tooltip div if it doesn't exist
    let tooltip = document.getElementById('chart-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.id = 'chart-tooltip';
      tooltip.style.cssText = `
        position: absolute; background: var(--panel); border: 1px solid var(--line);
        border-radius: 8px; padding: 8px 12px; font-size: 12px; color: var(--text);
        pointer-events: none; opacity: 0; transition: opacity 0.2s; z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      `;
      document.body.appendChild(tooltip);
    }
  
    // Axes and grid
    const drawLine = (x1, y1, x2, y2, className) => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x1);
      line.setAttribute('y1', y1);
      line.setAttribute('x2', x2);
      line.setAttribute('y2', y2);
      line.setAttribute('class', className);
      svg.appendChild(line);
    };
  
    drawLine(pad, H - pad, W - pad, H - pad, 'axis');
    drawLine(pad, pad, pad, H - pad, 'axis');
  
    for (let i = 0; i < 4; i++) {
      const y = pad + i * (H - 2 * pad) / 3;
      drawLine(pad, y, W - pad, y, 'grid');
      
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', 8);
      text.setAttribute('y', y + 4);
      text.setAttribute('class', 'reftext');
      text.textContent = (maxVal * (1 - i / 3)).toFixed(0) + ' MNOK';
      svg.appendChild(text);
    }
  
        // Interactive bars
    items.forEach((item, idx) => {
      const x = pad + 24 + idx * (bw + gap);
      const h = (item.val / maxVal) * (H - 2 * pad);
      const y = H - pad - h;
      
      // Bar group for hover effects
      const barGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      barGroup.style.cursor = onBarClick ? 'pointer' : 'default';
      
      // Main bar
      const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      bar.setAttribute('x', x);
      bar.setAttribute('y', y);
      bar.setAttribute('width', bw);
      bar.setAttribute('height', h);
      bar.setAttribute('rx', 6);
      bar.setAttribute('ry', 6);
      bar.setAttribute('fill', item.name === 'Indirect' ? '#74aeea' : '#19c5be');
      bar.style.transition = 'all 0.2s ease';
      
      // Hover overlay for glow effect
      const hoverBar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      hoverBar.setAttribute('x', x - 2);
      hoverBar.setAttribute('y', y - 2);
      hoverBar.setAttribute('width', bw + 4);
      hoverBar.setAttribute('height', h + 4);
      hoverBar.setAttribute('rx', 8);
      hoverBar.setAttribute('ry', 8);
      hoverBar.setAttribute('fill', 'none');
      hoverBar.setAttribute('stroke', item.name === 'Indirect' ? '#74aeea' : '#19c5be');
      hoverBar.setAttribute('stroke-width', 2);
      hoverBar.style.opacity = '0';
      hoverBar.style.transition = 'opacity 0.2s ease';
      
      barGroup.appendChild(hoverBar);
      barGroup.appendChild(bar);
      
      // Labels
      const nameText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      nameText.setAttribute('x', x + bw / 2);
      nameText.setAttribute('y', H - pad + 16);
      nameText.setAttribute('text-anchor', 'middle');
      nameText.setAttribute('class', 'reftext');
      nameText.textContent = item.name;
      
      const valueText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      valueText.setAttribute('x', x + bw / 2);
      valueText.setAttribute('y', y - 6);
      valueText.setAttribute('text-anchor', 'middle');
      valueText.setAttribute('class', 'reftext');
      valueText.textContent = Math.round(item.val);
      valueText.style.opacity = '0.8';
      valueText.style.transition = 'opacity 0.2s ease';
      
      // Mouse events
      barGroup.addEventListener('mouseenter', (e) => {
        hoverBar.style.opacity = '0.6';
        bar.style.transform = 'translateY(-2px)';
        valueText.style.opacity = '1';
        valueText.style.fontWeight = 'bold';
        
        // Show tooltip
        tooltip.innerHTML = `
          <strong>${item.name}</strong><br>
          Value: ${Math.round(item.val)} MNOK<br>
          ${item.percentage ? `Percentage: ${item.percentage}%` : ''}
        `;
        tooltip.style.opacity = '1';
      });
      
      barGroup.addEventListener('mousemove', (e) => {
        tooltip.style.left = (e.pageX + 10) + 'px';
        tooltip.style.top = (e.pageY - 10) + 'px';
      });
      
      barGroup.addEventListener('mouseleave', () => {
        hoverBar.style.opacity = '0';
        bar.style.transform = 'translateY(0)';
        valueText.style.opacity = '0.8';
        valueText.style.fontWeight = 'normal';
        tooltip.style.opacity = '0';
      });
      
      if (onBarClick) {
        barGroup.addEventListener('click', () => onBarClick(item, idx));
      }
      
      svg.appendChild(barGroup);
      svg.appendChild(nameText);
      svg.appendChild(valueText);
    });
  
    // Title
    if (title) {
      const titleText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      titleText.setAttribute('x', W / 2);
      titleText.setAttribute('y', 20);
      titleText.setAttribute('text-anchor', 'middle');
      titleText.setAttribute('class', 'reftext');
      titleText.style.fontSize = '14px';
      titleText.style.fontWeight = 'bold';
      titleText.textContent = title;
      svg.appendChild(titleText);
    }
  }
  
  // Interactive Table Enhancement
  function makeTableInteractive(tableId) {
    const table = document.querySelector(tableId);
    if (!table) return;
    
    // Add sorting functionality
    const headers = table.querySelectorAll('th');
    headers.forEach((header, index) => {
      if (header.textContent.trim() === '#') return; // Skip index column
      
      header.style.cursor = 'pointer';
      header.style.userSelect = 'none';
      header.style.position = 'relative';
      
      // Add sort indicator
      const sortIcon = document.createElement('span');
      sortIcon.style.cssText = `
        position: absolute; right: 4px; top: 50%; transform: translateY(-50%);
        opacity: 0.5; font-size: 10px; transition: opacity 0.2s;
      `;
      sortIcon.textContent = '↕';
      header.appendChild(sortIcon);
      
      header.addEventListener('mouseenter', () => {
        header.style.backgroundColor = 'rgba(25, 197, 190, 0.1)';
        sortIcon.style.opacity = '1';
      });
      
      header.addEventListener('mouseleave', () => {
        header.style.backgroundColor = '';
        sortIcon.style.opacity = '0.5';
      });
      
      let sortDirection = 'asc';
      header.addEventListener('click', () => {
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        
        rows.sort((a, b) => {
          const aVal = a.cells[index].textContent.trim();
          const bVal = b.cells[index].textContent.trim();
          
          // Try to parse as numbers
          const aNum = parseFloat(aVal.replace(/[^\d.-]/g, ''));
          const bNum = parseFloat(bVal.replace(/[^\d.-]/g, ''));
          
          if (!isNaN(aNum) && !isNaN(bNum)) {
            return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
          }
          
          // String comparison
          return sortDirection === 'asc' ? 
            aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        });
        
        // Update sort indicators
        headers.forEach(h => {
          const icon = h.querySelector('span');
          if (icon) icon.textContent = '↕';
        });
        
        sortIcon.textContent = sortDirection === 'asc' ? '↑' : '↓';
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        
        // Re-append sorted rows
        rows.forEach(row => tbody.appendChild(row));
      });
    });
    
    // Enhanced row hover effects
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
      row.addEventListener('mouseenter', () => {
        row.style.backgroundColor = 'rgba(25, 197, 190, 0.08)';
        row.style.transform = 'translateX(2px)';
        row.style.transition = 'all 0.2s ease';
      });
      
      row.addEventListener('mouseleave', () => {
        row.style.backgroundColor = '';
        row.style.transform = 'translateX(0)';
      });
    });
  }
  
  // Interactive Map Enhancement (for geographical data)
  function makeMapInteractive(mapContainerId, data) {
    const container = document.querySelector(mapContainerId);
    if (!container) return;
    
    // Create interactive pins/markers
    data.forEach((point, index) => {
      const marker = document.createElement('div');
      marker.className = 'map-marker';
      marker.style.cssText = `
        position: absolute;
        left: ${point.x}%;
        top: ${point.y}%;
        width: 12px;
        height: 12px;
        background: var(--teal);
        border: 2px solid var(--bg);
        border-radius: 50%;
        cursor: pointer;
        transform: translate(-50%, -50%);
        transition: all 0.2s ease;
        z-index: 5;
      `;
      
      marker.addEventListener('mouseenter', () => {
        marker.style.transform = 'translate(-50%, -50%) scale(1.5)';
        marker.style.zIndex = '10';
        
        // Show info popup
        const popup = document.createElement('div');
        popup.className = 'map-popup';
        popup.style.cssText = `
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 12px;
          white-space: nowrap;
          margin-bottom: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        popup.innerHTML = `
          <strong>${point.name}</strong><br>
          ${point.value ? `Value: ${point.value}` : ''}
          ${point.status ? `<br>Status: ${point.status}` : ''}
        `;
        marker.appendChild(popup);
      });
      
      marker.addEventListener('mouseleave', () => {
        marker.style.transform = 'translate(-50%, -50%) scale(1)';
        marker.style.zIndex = '5';
        const popup = marker.querySelector('.map-popup');
        if (popup) popup.remove();
      });
      
      if (point.onClick) {
        marker.addEventListener('click', () => point.onClick(point, index));
      }
      
      container.appendChild(marker);
    });
  }
  
  // Drill-down functionality for charts
  function addDrillDown(chartElement, drillDownData, onDrillDown) {
    chartElement.addEventListener('click', (e) => {
      const rect = chartElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Determine which segment was clicked and trigger drill-down
      if (onDrillDown) {
        onDrillDown(drillDownData, { x, y });
      }
    });
  }
  
  // Initialize all interactive elements
  function initializeInteractivity() {
    // Make all tables interactive
    document.querySelectorAll('table').forEach((table, index) => {
      makeTableInteractive(`#${table.id || 'table-' + index}`);
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Close any open tooltips or popups
        const tooltip = document.getElementById('chart-tooltip');
        if (tooltip) tooltip.style.opacity = '0';
      }
    });
  }