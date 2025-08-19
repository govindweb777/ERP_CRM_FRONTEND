import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const statusOptions = [
  { id: 1, option: 'Not Sure' },
  { id: 2, option: 'Completed' },
  { id: 3, option: 'Under Conversation' },
  { id: 4, option: 'Deal Closed' },
  { id: 5, option: 'Under Process' },
];

const sourceOptions = [
  { id: 1, option: 'LinkedIn' },
  { id: 2, option: 'Facebook' },
  { id: 3, option: 'Website' },
  { id: 4, option: 'Referral' },
  { id: 5, option: 'Other' },
];

const EditLeadModal = ({ lead, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: lead?.name || '',
    email: lead?.email || '',
    contactNo: lead?.contactNo || '',
    source: lead?.source || 'LinkedIn',
    status: lead?.status || 'Not Sure',
    remark: lead?.remark || '',
    notes: lead?.notes || '',
    industry: lead?.industry || '',
    Address: {
      detail: lead?.Address?.detail || '',
      pinCode: lead?.Address?.pinCode || '',
      city: lead?.Address?.city || '',
      country: lead?.Address?.country || 'India',
    },
    documents: null,
    assignedTo: lead?.assignedTo?._id || '',
  });
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [userLoading, setUserLoading] = useState(false);

  const VITE_FILE_BASE_URL = import.meta.env.VITE_FILE_BASE_URL || 'http://localhost:3000/';
  const authString = localStorage.getItem('auth');
  let token = '';
  if (authString) {
    try {
      const auth = JSON.parse(authString);
      token = auth?.current?.token || '';
    } catch (error) {
      console.error('Failed to parse auth from localStorage:', error);
    }
  }

  const fetchUsers = async () => {
    setUserLoading(true);
    try {
      const endpoint = 'get-All';
      const response = await fetch(`${VITE_FILE_BASE_URL}api/v1/user/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.success) {
        setUsers(result.admins || []);
      } else {
        console.error('Failed to fetch users:', result.message);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateLead = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.contactNo ||
      !formData.source ||
      !formData.assignedTo ||
      !formData.Address.pinCode ||
      !formData.Address.city ||
      !formData.Address.country
    ) {
      setFormError(
        'Name, Email, Contact Number, Source, Assigned To, Pin Code, City, and Country are required'
      );
      return;
    }

    if (isNaN(formData.contactNo) || isNaN(formData.Address.pinCode)) {
      setFormError('Contact Number and Pin Code must be valid numbers');
      return;
    }

    setLoading(true);
    setFormError('');
    try {
      const formDataToSend = new FormData();
      
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('contactNo', formData.contactNo);
      formDataToSend.append('source', formData.source);
      formDataToSend.append('assignedTo', formData.assignedTo);
      
      formDataToSend.append('Address', JSON.stringify({
        detail: formData.Address.detail || '',
        pinCode: Number(formData.Address.pinCode),
        city: formData.Address.city,
        country: formData.Address.country,
      }));
      
      if (formData.status) formDataToSend.append('status', formData.status);
      if (formData.remark) formDataToSend.append('remark', formData.remark);
      if (formData.notes) formDataToSend.append('notes', formData.notes);
      if (formData.industry) formDataToSend.append('industry', formData.industry);
      if (formData.documents) formDataToSend.append('documents', formData.documents);

      const response = await fetch(`${VITE_FILE_BASE_URL}api/v1/lead/update/${lead._id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      });

      const result = await response.json();
      if (result.success) {
        onUpdate();
        onClose();
      } else {
        const errorMessage = result.error
          ? result.error.includes('Validation failed')
            ? result.error
                .split(':')
                .slice(1)
                .map((err) => err.split(',')[0].trim())
                .join(', ')
            : result.error
          : result.message || 'Failed to update lead';
        setFormError(errorMessage);
      }
    } catch (error) {
      console.error('Error updating lead:', error);
      setFormError('Failed to update lead: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'documents') {
      setFormData((prev) => ({ ...prev, documents: files[0] }));
    } else if (name.startsWith('Address.')) {
      const addressField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        Address: { ...prev.Address, [addressField]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
        zIndex: 9999,
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        maxWidth: '896px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>
            Edit Lead
          </h2>
          <button
            onClick={onClose}
            style={{
              padding: '8px',
              color: '#6b7280',
              transition: 'color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#4b5563'}
            onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}
          >
            <X size={24} />
          </button>
        </div>
        
        <div style={{ padding: '24px' }}>
          {formError && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fee2e2',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px'
            }}>
              <span style={{ color: '#b91c1c' }}>{formError}</span>
            </div>
          )}
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '24px',
            '@media (min-width: 768px)': { gridTemplateColumns: '1fr 1fr' }
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                placeholder="Enter full name"
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.5)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                placeholder="Enter email address"
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.5)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Contact Number *
              </label>
              <input
                type="tel"
                name="contactNo"
                value={formData.contactNo}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                placeholder="Enter contact number"
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.5)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Source *
              </label>
              <select
                name="source"
                value={formData.source}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.5)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {sourceOptions.map((opt) => (
                  <option key={opt.id} value={opt.option}>
                    {opt.option}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Assigned To *
              </label>
              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleInputChange}
                required
                disabled={userLoading}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  backgroundColor: userLoading ? '#f3f4f6' : '#ffffff'
                }}
                onFocus={(e) => {
                  if (!userLoading) {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.5)';
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
              {userLoading && (
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '8px' }}>
                  Loading users...
                </p>
              )}
            </div>
            
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.5)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {statusOptions.map((opt) => (
                  <option key={opt.id} value={opt.option}>
                    {opt.option}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Industry
              </label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                placeholder="Enter industry"
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.5)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Remark
              </label>
              <input
                type="text"
                name="remark"
                value={formData.remark}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                placeholder="Enter remark"
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.5)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>
          
          <div style={{ marginTop: '32px' }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '16px'
            }}>
              Address Information
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Address Detail
              </label>
              <input
                type="text"
                name="Address.detail"
                value={formData.Address.detail}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                placeholder="House no, Street, etc."
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.5)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '16px',
              '@media (min-width: 768px)': { gridTemplateColumns: '1fr 1fr 1fr' }
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Pin Code *
                </label>
                <input
                  type="number"
                  name="Address.pinCode"
                  value={formData.Address.pinCode}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  placeholder="Enter pin code"
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.5)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  City *
                </label>
                <input
                  type="text"
                  name="Address.city"
                  value={formData.Address.city}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  placeholder="Enter city"
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.5)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Country *
                </label>
                <input
                  type="text"
                  name="Address.country"
                  value={formData.Address.country}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  placeholder="Enter country"
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.5)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Documents
            </label>
            <input
              type="file"
              name="documents"
              onChange={handleInputChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.5)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = 'none';
              }}
            />
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '8px' }}>
              Upload PDF, DOC, or image files (Optional, leave blank to keep existing document)
            </p>
            {lead?.documents && (
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '8px' }}>
                Current Document: <a
                  href={lead.documents}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#2563eb', textDecoration: 'none' }}
                  onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
                >View</a>
              </p>
            )}
          </div>
          
          <div style={{
            display: 'flex',
            gap: '16px',
            paddingTop: '24px',
            borderTop: '1px solid #e5e7eb',
            marginTop: '32px'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: '1',
                padding: '12px 24px',
                border: '1px solid #d1d5db',
                color: '#374151',
                borderRadius: '8px',
                fontWeight: '500',
                transition: 'background-color 0.2s',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={updateLead}
              disabled={loading}
              style={{
                flex: '1',
                padding: '12px 24px',
                backgroundColor: loading ? '#93c5fd' : '#2563eb',
                color: '#ffffff',
                borderRadius: '8px',
                fontWeight: '500',
                transition: 'background-color 0.2s',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? '0.5' : '1'
              }}
              onMouseOver={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = '#1d4ed8';
              }}
              onMouseOut={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = '#2563eb';
              }}
            >
              {loading ? 'Updating...' : 'Update Lead'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditLeadModal;