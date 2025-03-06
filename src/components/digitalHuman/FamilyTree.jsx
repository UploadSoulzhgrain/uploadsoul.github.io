import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const FamilyTree = ({ digitalHumanId, width = '100%', height = '500px' }) => {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRelative, setNewRelative] = useState({
    name: '',
    relationship: 'child',
    photo: null,
    dateOfBirth: '',
    dateOfDeath: '',
    bio: '',
  });

  // Mock data - In production this would come from an API
  const fetchFamilyData = useCallback(async () => {
    // Simulate API call
    setTimeout(() => {
      const mockNodes = [
        { id: '1', label: '나', type: 'self', photo: '/assets/avatars/default-avatar.png' },
        { id: '2', label: '어머니', type: 'parent', photo: '/assets/avatars/female-avatar.png' },
        { id: '3', label: '아버지', type: 'parent', photo: '/assets/avatars/male-avatar.png' },
        { id: '4', label: '할머니', type: 'grandparent', photo: '/assets/avatars/elder-female.png' },
        { id: '5', label: '할아버지', type: 'grandparent', photo: '/assets/avatars/elder-male.png' },
        { id: '6', label: '아들', type: 'child', photo: '/assets/avatars/child-male.png' },
        { id: '7', label: '딸', type: 'child', photo: '/assets/avatars/child-female.png' },
      ];

      const mockEdges = [
        { from: '1', to: '2', relationship: 'parent' },
        { from: '1', to: '3', relationship: 'parent' },
        { from: '3', to: '4', relationship: 'parent' },
        { from: '3', to: '5', relationship: 'parent' },
        { from: '1', to: '6', relationship: 'child' },
        { from: '1', to: '7', relationship: 'child' },
      ];

      setNodes(mockNodes);
      setEdges(mockEdges);
    }, 1000);
  }, []);

  useEffect(() => {
    fetchFamilyData();
  }, [fetchFamilyData, digitalHumanId]);

  // Initialize the tree visualization
  useEffect(() => {
    if (containerRef.current && nodes.length > 0) {
      // For now we'll render our own visualization,
      // but in production we could use a library like react-d3-tree or vis-network
      renderFamilyTree();
    }
  }, [nodes, edges]);

  const renderFamilyTree = () => {
    // This is a basic placeholder - a real implementation would use a proper tree visualization library
    // Here we just create a visual representation using divs and CSS
    const container = containerRef.current;
    container.innerHTML = '';

    // Create a central container
    const treeContainer = document.createElement('div');
    treeContainer.className = 'family-tree-container';
    treeContainer.style.position = 'relative';
    treeContainer.style.width = '100%';
    treeContainer.style.height = '100%';
    container.appendChild(treeContainer);

    // In a real implementation, position nodes based on relationships
    // For this mock version, we'll just place them in pre-defined positions
    const positions = {
      'grandparent': { top: '10%', left: ['20%', '35%'] },
      'parent': { top: '30%', left: ['25%', '40%'] },
      'self': { top: '50%', left: ['32.5%'] },
      'child': { top: '70%', left: ['25%', '40%'] },
    };

    // Track used positions
    const usedPositions = {};
    
    // Place nodes
    nodes.forEach((node) => {
      const nodeDiv = document.createElement('div');
      nodeDiv.className = 'family-tree-node';
      nodeDiv.id = `node-${node.id}`;
      nodeDiv.dataset.nodeId = node.id;
      nodeDiv.style.position = 'absolute';
      nodeDiv.style.width = '80px';
      nodeDiv.style.height = '80px';
      nodeDiv.style.borderRadius = '50%';
      nodeDiv.style.overflow = 'hidden';
      nodeDiv.style.border = '3px solid #6366f1';
      nodeDiv.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      nodeDiv.style.cursor = 'pointer';
      nodeDiv.style.zIndex = '10';

      // Calculate position based on node type
      const typePositions = positions[node.type];
      if (typePositions) {
        const typeCounts = usedPositions[node.type] || 0;
        const leftIndexToUse = typeCounts % typePositions.left.length;
        nodeDiv.style.top = typePositions.top;
        nodeDiv.style.left = typePositions.left[leftIndexToUse];
        usedPositions[node.type] = typeCounts + 1;
      } else {
        // Fallback positioning
        nodeDiv.style.top = '50%';
        nodeDiv.style.left = '50%';
      }

      // Add image
      const img = document.createElement('img');
      img.src = node.photo;
      img.alt = node.label;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      nodeDiv.appendChild(img);

      // Add label
      const label = document.createElement('div');
      label.textContent = node.label;
      label.style.position = 'absolute';
      label.style.bottom = '-25px';
      label.style.left = '0';
      label.style.right = '0';
      label.style.textAlign = 'center';
      label.style.fontWeight = '500';
      label.style.color = '#4b5563';
      nodeDiv.appendChild(label);

      // Add click handler
      nodeDiv.onclick = () => {
        setSelectedNode(node);
      };

      treeContainer.appendChild(nodeDiv);
    });

    // Draw edges
    edges.forEach((edge) => {
      const fromNode = document.getElementById(`node-${edge.from}`);
      const toNode = document.getElementById(`node-${edge.to}`);

      if (fromNode && toNode) {
        const fromRect = fromNode.getBoundingClientRect();
        const toRect = toNode.getBoundingClientRect();
        const containerRect = treeContainer.getBoundingClientRect();

        const startX = fromRect.left - containerRect.left + fromRect.width / 2;
        const startY = fromRect.top - containerRect.top + fromRect.height / 2;
        const endX = toRect.left - containerRect.left + toRect.width / 2;
        const endY = toRect.top - containerRect.top + toRect.height / 2;

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.style.zIndex = '5';
        svg.style.pointerEvents = 'none';

        const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const delta = Math.abs(endY - startY) / 2;
        const path = `M ${startX} ${startY} C ${startX} ${startY + delta}, ${endX} ${endY - delta}, ${endX} ${endY}`;
        line.setAttribute("d", path);
        line.setAttribute("stroke", "#9ca3af");
        line.setAttribute("stroke-width", "2");
        line.setAttribute("fill", "none");

        svg.appendChild(line);
        treeContainer.appendChild(svg);
      }
    });
  };

  const handleAddRelative = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setNewRelative({
      name: '',
      relationship: 'child',
      photo: null,
      dateOfBirth: '',
      dateOfDeath: '',
      bio: '',
    });
  };

  const handleSubmitRelative = (e) => {
    e.preventDefault();
    
    // In a real app, we would POST to API
    // For now, just update local state
    const newId = (nodes.length + 1).toString();
    const newNode = {
      id: newId,
      label: newRelative.name,
      type: newRelative.relationship,
      photo: newRelative.photo || '/assets/avatars/default-avatar.png'
    };
    
    const newEdge = {
      from: selectedNode ? selectedNode.id : '1', // Default to self if no node selected
      to: newId,
      relationship: newRelative.relationship
    };
    
    setNodes([...nodes, newNode]);
    setEdges([...edges, newEdge]);
    handleCloseModal();
  };

  const handlePhotoChange = (e) => {
    // In a real app, we would handle file upload
    // For now, just update state with a mock image path
    setNewRelative({
      ...newRelative,
      photo: '/assets/avatars/default-avatar.png'
    });
  };

  return (
    <div className="family-tree bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">{t('digitalHuman.familyTree')}</h3>
        <div className="space-x-2">
          <button 
            onClick={handleAddRelative}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            {t('digitalHuman.addRelative')}
          </button>
        </div>
      </div>

      <div 
        ref={containerRef} 
        className="family-tree-visualization border border-gray-200 rounded-lg" 
        style={{ width, height }}
      >
        {/* Tree will be rendered here */}
        {nodes.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-500">
            {t('digitalHuman.loadingFamilyTree')}
          </div>
        )}
      </div>

      {selectedNode && (
        <div className="mt-4 p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-500">
              <img 
                src={selectedNode.photo} 
                alt={selectedNode.label}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-medium text-gray-800">{selectedNode.label}</h4>
              <p className="text-sm text-gray-600">{t(`digitalHuman.relationshipTypes.${selectedNode.type}`)}</p>
            </div>
            <div className="ml-auto space-x-2">
              <button 
                className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                onClick={() => {/* Edit functionality */}}
              >
                {t('digitalHuman.edit')}
              </button>
              <button 
                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                onClick={() => {/* Remove functionality */}}
              >
                {t('digitalHuman.remove')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Relative Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">{t('digitalHuman.addRelative')}</h3>
            
            <form onSubmit={handleSubmitRelative}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">{t('digitalHuman.name')}</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newRelative.name}
                  onChange={(e) => setNewRelative({...newRelative, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">{t('digitalHuman.relationship')}</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newRelative.relationship}
                  onChange={(e) => setNewRelative({...newRelative, relationship: e.target.value})}
                  required
                >
                  <option value="parent">{t('digitalHuman.relationshipTypes.parent')}</option>
                  <option value="child">{t('digitalHuman.relationshipTypes.child')}</option>
                  <option value="sibling">{t('digitalHuman.relationshipTypes.sibling')}</option>
                  <option value="spouse">{t('digitalHuman.relationshipTypes.spouse')}</option>
                  <option value="grandparent">{t('digitalHuman.relationshipTypes.grandparent')}</option>
                  <option value="grandchild">{t('digitalHuman.relationshipTypes.grandchild')}</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">{t('digitalHuman.photo')}</label>
                <input
                  type="file"
                  className="w-full"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">{t('digitalHuman.dateOfBirth')}</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newRelative.dateOfBirth}
                  onChange={(e) => setNewRelative({...newRelative, dateOfBirth: e.target.value})}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">{t('digitalHuman.dateOfDeath')}</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newRelative.dateOfDeath}
                  onChange={(e) => setNewRelative({...newRelative, dateOfDeath: e.target.value})}
                />
                <p className="text-sm text-gray-500 mt-1">{t('digitalHuman.leaveEmptyIfAlive')}</p>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">{t('digitalHuman.bio')}</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows="3"
                  value={newRelative.bio}
                  onChange={(e) => setNewRelative({...newRelative, bio: e.target.value})}
                />
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  onClick={handleCloseModal}
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyTree;