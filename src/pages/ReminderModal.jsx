import React, { useState } from 'react';
import { RxCross2, RxTrash } from 'react-icons/rx';

const RemindersModal = ({ lead, reminders, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    leadId: lead?._id || '',
    title: '',
    date: '',
    time: '',
  });
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

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

  const createReminder = async () => {
    if (!formData.title || !formData.date || !formData.time || (!formData.leadId && lead)) {
      setFormError('Title, Date, and Time are required');
      return;
    }

    setLoading(true);
    setFormError('');
    try {
      const response = await fetch(`${VITE_FILE_BASE_URL}api/v1/reminder/add`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        setFormData({ leadId: lead?._id || '', title: '', date: '', time: '' });
        onUpdate();
      } else {
        setFormError(result.message || 'Failed to create reminder');
      }
    } catch (error) {
      console.error('Error creating reminder:', error);
      setFormError('Failed to create reminder');
    } finally {
      setLoading(false);
    }
  };

  const deleteReminder = async (reminderId) => {
    if (!confirm('Are you sure you want to delete this reminder?')) return;
    setLoading(true);
    try {
      const response = await fetch(`${VITE_FILE_BASE_URL}api/v1/reminder/delete/${reminderId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.success) {
        onUpdate();
      } else {
        console.error('Failed to delete reminder:', result.message);
      }
    } catch (error) {
      console.error('Error deleting reminder:', error);
      setFormError('Failed to delete reminder');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          maxWidth: 700,
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
        }}
      >
        <div
          style={{
            padding: 24,
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#222' }}>
            {lead ? `Reminders for ${lead.name}` : 'All Reminders'}
          </h2>
          <button
            onClick={onClose}
            style={{
              padding: 8,
              color: '#888',
              background: 'transparent',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = '#444')}
            onMouseOut={(e) => (e.currentTarget.style.color = '#888')}
          >
            <RxCross2 size={25} />
          </button>
        </div>
        <div style={{ padding: 24 }}>
          {formError && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 8,
                padding: 16,
                display: 'flex',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <span style={{ color: '#b91c1c' }}>{formError}</span>
            </div>
          )}
          {lead && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 500, color: '#222', marginBottom: 12 }}>
                Add New Reminder
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                <div style={{ flex: '1 1 200px', minWidth: 200 }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: 14,
                      fontWeight: 500,
                      color: '#444',
                      marginBottom: 8,
                    }}
                  >
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: 8,
                      fontSize: 15,
                      marginBottom: 0,
                    }}
                    placeholder="Enter reminder title"
                  />
                </div>
                <div style={{ flex: '1 1 200px', minWidth: 200 }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: 14,
                      fontWeight: 500,
                      color: '#444',
                      marginBottom: 8,
                    }}
                  >
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: 8,
                      fontSize: 15,
                      marginBottom: 0,
                    }}
                  />
                </div>
                <div style={{ flex: '1 1 200px', minWidth: 200 }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: 14,
                      fontWeight: 500,
                      color: '#444',
                      marginBottom: 8,
                    }}
                  >
                    Time *
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: 8,
                      fontSize: 15,
                      marginBottom: 0,
                    }}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={createReminder}
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  background: loading ? '#60a5fa' : '#2563eb',
                  color: '#fff',
                  borderRadius: 8,
                  border: 'none',
                  fontWeight: 600,
                  fontSize: 16,
                  marginTop: 16,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  transition: 'background 0.2s',
                }}
              >
                {loading ? 'Creating...' : 'Add Reminder'}
              </button>
            </div>
          )}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 500, color: '#222', marginBottom: 12 }}>
              Reminders List
            </h3>
            {reminders.length === 0 ? (
              <p style={{ color: '#6b7280', fontSize: 15 }}>No reminders found.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ minWidth: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ background: '#CDE4DA' }}>
                    <tr>
                      <th
                        style={{
                          padding: '12px 16px',
                          textAlign: 'left',
                          fontSize: 13,
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          color: '#222',
                        }}
                      >
                        Title
                      </th>
                      <th
                        style={{
                          padding: '12px 16px',
                          textAlign: 'left',
                          fontSize: 13,
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          color: '#222',
                        }}
                      >
                        Date
                      </th>
                      <th
                        style={{
                          padding: '12px 16px',
                          textAlign: 'left',
                          fontSize: 13,
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          color: '#222',
                        }}
                      >
                        Time
                      </th>
                      {lead ? null : (
                        <th
                          style={{
                            padding: '12px 16px',
                            textAlign: 'left',
                            fontSize: 13,
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            color: '#222',
                          }}
                        >
                          Lead Name
                        </th>
                      )}
                      <th
                        style={{
                          padding: '12px 16px',
                          textAlign: 'left',
                          fontSize: 13,
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          color: '#222',
                        }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody style={{ background: '#fff' }}>
                    {reminders.map((reminder) => (
                      <tr key={reminder._id}>
                        <td style={{ padding: '16px', fontSize: 15 }}>{reminder.title}</td>
                        <td style={{ padding: '16px', fontSize: 15 }}>
                          {new Date(reminder.date).toLocaleDateString('en-US')}
                        </td>
                        <td style={{ padding: '16px', fontSize: 15 }}>{reminder.time}</td>
                        {lead ? null : (
                          <td style={{ padding: '16px', fontSize: 15 }}>
                            {reminder.leadId?.name || 'N/A'}
                          </td>
                        )}
                        <td style={{ padding: '16px', fontSize: 15 }}>
                          <button
                            onClick={() => deleteReminder(reminder._id)}
                            style={{
                              color: '#dc2626',
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'color 0.2s',
                            }}
                            title="Delete Reminder"
                            onMouseOver={(e) => (e.currentTarget.style.color = '#b91c1c')}
                            onMouseOut={(e) => (e.currentTarget.style.color = '#dc2626')}
                          >
                            <RxTrash size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 16, paddingTop: 24, borderTop: '1px solid #e5e7eb' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px 24px',
                border: '1px solid #d1d5db',
                color: '#444',
                borderRadius: 8,
                background: '#fff',
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: 16,
                transition: 'background 0.2s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = '#f3f4f6')}
              onMouseOut={(e) => (e.currentTarget.style.background = '#fff')}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemindersModal;
