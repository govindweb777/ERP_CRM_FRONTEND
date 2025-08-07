'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { RxTriangleDown, RxCross2 } from 'react-icons/rx';
import { Filter, Mail, Edit, Trash2, Calendar } from 'lucide-react';
import CreateLeadModal from './CreateLeadModal';
import RemindersModal from './ReminderModal';

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

const LeadTable = ({ onEditLead, campaignId }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState([]);
  const [sourceFilter, setSourceFilter] = useState([]);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isSourceDropdownOpen, setIsSourceDropdownOpen] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [showRemindersModal, setShowRemindersModal] = useState(false);
  const [selectedLeadForReminders, setSelectedLeadForReminders] = useState(null);
  const [reminders, setReminders] = useState([]);
  const containerRef = useRef(null);
  const statusRef = useRef(null);
  const sourceRef = useRef(null);

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

  const tableHeadings = [
    'Name',
    'Email',
    'Contact',
    'Source',
    'Status',
    'Industry',
    'City',
    'Created At',
  ];

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const endpoint = filterActive ? 'get-active-lead' : 'get-all';
      const response = await fetch(`${VITE_FILE_BASE_URL}api/v1/lead/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      let result = await response.json();
      if (result.success) {
        result = result.data || [];
        if (searchTerm) {
          result = result.filter(
            (lead) =>
              lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              lead.email.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        if (statusFilter.length > 0) {
          result = result.filter((lead) => statusFilter.includes(lead.status));
        }
        if (sourceFilter.length > 0) {
          result = result.filter((lead) => sourceFilter.includes(lead.source));
        }
        setLeads(result);
      } else {
        console.error('Failed to fetch leads:', result.message);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllReminders = async () => {
    try {
      const response = await fetch(`${VITE_FILE_BASE_URL}api/v1/reminder/get-All`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.success) {
        setReminders(result.reminders || []);
      } else {
        console.error('Failed to fetch reminders:', result.message);
      }
    } catch (error) {
      console.error('Error fetching reminders:', error);
    }
  };

  const fetchRemindersByLeadId = async (leadId) => {
    try {
      const response = await fetch(`${VITE_FILE_BASE_URL}api/v1/reminder/getByLeadId/${leadId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.success) {
        setReminders(result.reminders || []);
      } else {
        console.error('Failed to fetch reminders:', result.message);
      }
    } catch (error) {
      console.error('Error fetching reminders:', error);
    }
  };

  const handleSearch = () => {
    fetchLeads();
  };

  const handleStatusToggle = (item) => {
    setStatusFilter((prev) =>
      prev.includes(item.option)
        ? prev.filter((opt) => opt !== item.option)
        : [...prev, item.option]
    );
  };

  const handleSourceToggle = (item) => {
    setSourceFilter((prev) =>
      prev.includes(item.option)
        ? prev.filter((opt) => opt !== item.option)
        : [...prev, item.option]
    );
  };

  const handleSelectLead = (leadId) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId) ? prev.filter((id) => id !== leadId) : [...prev, leadId]
    );
  };

  const deleteLead = async (id) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    setLoading(true);
    try {
      const response = await fetch(`${VITE_FILE_BASE_URL}api/v1/lead/delete/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.success) {
        fetchLeads();
        setSelectedLeads((prev) => prev.filter((leadId) => leadId !== id));
      } else {
        console.error('Failed to delete lead:', result.message);
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLeadStatus = async (id, isActive) => {
    setLoading(true);
    try {
      const endpoint = isActive ? 'deactivate-lead' : 'activate-lead';
      const response = await fetch(`${VITE_FILE_BASE_URL}api/v1/lead/${endpoint}/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.success) {
        fetchLeads();
      } else {
        console.error(`Failed to ${isActive ? 'deactivate' : 'activate'} lead:`, result.message);
      }
    } catch (error) {
      console.error(`Error ${isActive ? 'deactivating' : 'activating'} lead:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter([]);
    setSourceFilter([]);
    fetchLeads();
  };

  useEffect(() => {
    fetchLeads();
  }, [filterActive, statusFilter, sourceFilter]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setIsStatusDropdownOpen(false);
      }
      if (sourceRef.current && !sourceRef.current.contains(event.target)) {
        setIsSourceDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // ...existing code...
  return (
    <main
      style={{
        fontFamily: 'Inter, sans-serif',
        minHeight: '95vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <section>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
          }}
        >
          <h1 style={{ fontSize: 20, fontWeight: 600 }}>Lead Management</h1>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => {
                setShowRemindersModal(true);
                fetchAllReminders();
              }}
              style={{
                padding: '8px 16px',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 500,
                background: '#2563eb',
                color: '#fff',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              Show All Reminders
            </button>
            <div style={{ display: 'flex', background: '#318FFF66', padding: 3, borderRadius: 10 }}>
              <button
                onClick={() => setFilterActive(!filterActive)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '8px',
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: 'pointer',
                  background: '#fff',
                  border: 'none',
                }}
              >
                <Filter size={16} />
                <span>{filterActive ? 'Show All Leads' : 'Show Active Leads'}</span>
              </button>
            </div>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 10, padding: 16, marginBottom: 24 }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 16,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                position: 'relative',
                flexGrow: 1,
                minWidth: 240,
                maxWidth: 340,
                border: '2px solid #e5e7eb',
                borderRadius: 10,
              }}
            >
              <input
                type="search"
                placeholder="Search by Name/Email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '92%',
                  padding: '8px',
                  fontSize: 14,
                  border: 'none',
                  outline: 'none',
                  color: '#222',
                  background: 'transparent',
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
              />
              <AiOutlineSearch
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  width: 20,
                  height: 20,
                  color: '#222',
                }}
                onClick={handleSearch}
              />
            </div>

            <div style={{ position: 'relative' }} ref={statusRef}>
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.12))',
                  padding: 10,
                  borderRadius: 10,
                  fontSize: 14,
                  border: '1px solid #d1d5db',
                  cursor: 'pointer',
                }}
                onClick={() => setIsStatusDropdownOpen((p) => !p)}
              >
                <span style={{ fontSize: 14 }}>Status</span>
                <RxTriangleDown
                  size={16}
                  style={{
                    marginLeft: 12,
                    transform: isStatusDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s',
                  }}
                />
              </button>
              {isStatusDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    marginTop: 2,
                    top: '100%',
                    minWidth: 96,
                    background: '#fff',
                    border: '1px solid #2222',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    zIndex: 50,
                    maxHeight: 192,
                    borderRadius: 10,
                    overflowY: 'auto',
                  }}
                >
                  {statusOptions.map((item) => (
                    <p
                      key={item.id}
                      style={{
                        margin: 4,
                        padding: '4px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        fontSize: 12,
                        color: '#222',
                        background: statusFilter.includes(item.option) ? '#E9F5F0' : '#fff',
                        borderRadius: 6,
                      }}
                      onClick={() => handleStatusToggle(item)}
                    >
                      {item.option}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <div style={{ position: 'relative' }} ref={sourceRef}>
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.12))',
                  padding: 10,
                  borderRadius: 10,
                  fontSize: 14,
                  border: '1px solid #d1d5db',
                  cursor: 'pointer',
                }}
                onClick={() => setIsSourceDropdownOpen((p) => !p)}
              >
                <span style={{ fontSize: 14 }}>Source</span>
                <RxTriangleDown
                  size={16}
                  style={{
                    marginLeft: 12,
                    transform: isSourceDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s',
                  }}
                />
              </button>
              {isSourceDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    marginTop: 2,
                    top: '100%',
                    minWidth: 96,
                    background: '#fff',
                    border: '1px solid #2222',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    zIndex: 50,
                    maxHeight: 192,
                    borderRadius: 10,
                    overflowY: 'auto',
                  }}
                >
                  {sourceOptions.map((item) => (
                    <p
                      key={item.id}
                      style={{
                        margin: 4,
                        padding: '4px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        fontSize: 12,
                        color: '#222',
                        background: sourceFilter.includes(item.option) ? '#E9F5F0' : '#fff',
                        borderRadius: 6,
                      }}
                      onClick={() => handleSourceToggle(item)}
                    >
                      {item.option}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowCreateForm(true)}
              style={{
                position: 'relative',
                padding: '8px 16px',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 500,
                background: '#E96D70',
                color: '#fff',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              Add Lead
              {selectedLeads.length > 0 && (
                <span
                  style={{
                    fontSize: 12,
                    position: 'absolute',
                    right: -16,
                    top: -16,
                    background: '#F4BB3F',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 600,
                  }}
                >
                  {selectedLeads.length}
                </span>
              )}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
            <p style={{ fontSize: 14, whiteSpace: 'nowrap' }}>
              Showing results for {leads.length.toLocaleString() || 0} Leads
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              {statusFilter.map((status, i) => (
                <p
                  key={`status-${i}`}
                  style={{
                    background: '#F4BB3F',
                    borderRadius: 6,
                    color: '#fff',
                    padding: '2px 8px',
                    fontSize: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <span>{status}</span>
                  <RxCross2
                    style={{
                      borderRadius: '50%',
                      position: 'relative',
                      top: -1,
                      border: '2px solid #fff',
                      padding: 1,
                      boxSizing: 'content-box',
                      cursor: 'pointer',
                    }}
                    size={10}
                    onClick={() => setStatusFilter((prev) => prev.filter((opt) => opt !== status))}
                  />
                </p>
              ))}
              {sourceFilter.map((source, i) => (
                <p
                  key={`source-${i}`}
                  style={{
                    background: '#F4BB3F',
                    borderRadius: 6,
                    color: '#fff',
                    padding: '2px 8px',
                    fontSize: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <span>{source}</span>
                  <RxCross2
                    style={{
                      borderRadius: '50%',
                      position: 'relative',
                      top: -1,
                      border: '2px solid #fff',
                      padding: 1,
                      boxSizing: 'content-box',
                      cursor: 'pointer',
                    }}
                    size={10}
                    onClick={() => setSourceFilter((prev) => prev.filter((opt) => opt !== source))}
                  />
                </p>
              ))}
              {(searchTerm || statusFilter.length > 0 || sourceFilter.length > 0) && (
                <button
                  type="button"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    marginLeft: 16,
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                  }}
                  onClick={handleClearFilters}
                >
                  <p style={{ fontSize: 14, fontWeight: 500, color: '#666' }}>Clear filters</p>
                  <RxCross2 size={17} style={{ color: '#666' }} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div
          style={{
            background: '#F5F5F5',
            position: 'relative',
            padding: '20px 0',
            marginLeft: -32,
            marginRight: -32,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {loading && leads.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '40px 0', color: '#666', fontWeight: 500 }}>
              Loading...
            </p>
          ) : (
            <div
              style={{
                borderRadius: 10,
                border: '1px solid #76E4B6',
                marginLeft: 32,
                marginRight: 32,
                maxHeight: 430,
                overflowY: 'auto',
                width: '100%',
                overflowX: 'auto',
                background: '#fff',
              }}
              ref={containerRef}
            >
              <table
                style={{
                  minWidth: '100%',
                  borderCollapse: 'collapse',
                  width: leads.length === 0 && !loading ? '100%' : undefined,
                  tableLayout: leads.length === 0 && !loading ? 'fixed' : undefined,
                }}
              >
                <thead style={{ background: '#CDE4DA', position: 'sticky', top: 0, zIndex: 25 }}>
                  {leads.length === 0 && !loading ? (
                    <tr>
                      <th
                        colSpan={10}
                        style={{
                          padding: '12px 16px',
                          fontSize: 12,
                          fontWeight: 600,
                          textAlign: 'center',
                        }}
                      >
                        <p>---</p>
                      </th>
                    </tr>
                  ) : (
                    <tr>
                      <th
                        style={{
                          padding: '12px 16px',
                          position: 'sticky',
                          left: 0,
                          zIndex: 50,
                          background: '#CDE4DA',
                        }}
                      ></th>
                      {tableHeadings.map((heading, i) => (
                        <th
                          key={i}
                          style={{
                            padding: '12px 16px',
                            textAlign: 'left',
                            fontSize: 12,
                            fontWeight: 600,
                            letterSpacing: 0.5,
                            whiteSpace: 'nowrap',
                            borderRight: '1px solid #2222',
                          }}
                        >
                          <span style={{ textTransform: 'uppercase' }}>{heading}</span>
                        </th>
                      ))}
                      <th
                        style={{
                          padding: '12px 16px',
                          textAlign: 'left',
                          fontSize: 12,
                          fontWeight: 600,
                          letterSpacing: 0.5,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Actions
                      </th>
                    </tr>
                  )}
                </thead>
                <tbody style={{ background: '#fff' }}>
                  {loading && leads.length === 0 ? (
                    <tr>
                      <td colSpan="10" style={{ padding: '32px 16px', textAlign: 'center' }}>
                        <p style={{ color: '#888', fontWeight: 500 }}>Loading...</p>
                      </td>
                    </tr>
                  ) : leads.length === 0 ? (
                    <tr>
                      <td
                        colSpan="10"
                        style={{
                          color: '#888',
                          fontWeight: 500,
                          padding: '32px 16px',
                          textAlign: 'center',
                        }}
                      >
                        <p>No Results Found.</p>
                        <p>Edit Filters to see updated results.</p>
                      </td>
                    </tr>
                  ) : (
                    leads.map((lead, index) => (
                      <tr key={index}>
                        <td style={{ background: '#fff' }}></td>
                        <td
                          style={{
                            background: '#fff',
                            padding: '16px',
                            borderRight: '1px solid #2222',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                              width: 'max-content',
                            }}
                          >
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <span
                                  style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap' }}
                                >
                                  {lead.name || 'N/A'}
                                </span>
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  fontSize: 12,
                                  marginTop: 4,
                                  color: '#888',
                                  gap: 4,
                                }}
                              >
                                <Mail size={14} />
                                <span style={{ lineHeight: 1 }}>{lead.email || 'N/A'}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td
                          style={{
                            padding: '16px',
                            fontSize: 14,
                            color: '#00000080',
                            borderRight: '1px solid #2222',
                          }}
                        >
                          {lead.email || 'N/A'}
                        </td>
                        <td
                          style={{
                            padding: '16px',
                            fontSize: 14,
                            color: '#00000080',
                            borderRight: '1px solid #2222',
                          }}
                        >
                          {lead.contactNo || 'N/A'}
                        </td>
                        <td
                          style={{
                            padding: '16px',
                            fontSize: 14,
                            color: '#00000080',
                            borderRight: '1px solid #2222',
                          }}
                        >
                          {lead.source || 'N/A'}
                        </td>
                        <td
                          style={{
                            padding: '16px',
                            fontSize: 14,
                            color: '#00000080',
                            borderRight: '1px solid #2222',
                          }}
                        >
                          {lead.status || 'N/A'}
                        </td>
                        <td
                          style={{
                            padding: '16px',
                            fontSize: 14,
                            color: '#00000080',
                            borderRight: '1px solid #2222',
                          }}
                        >
                          {lead.industry || 'N/A'}
                        </td>
                        <td
                          style={{
                            padding: '16px',
                            fontSize: 14,
                            color: '#00000080',
                            borderRight: '1px solid #2222',
                          }}
                        >
                          {lead.Address?.city || 'N/A'}
                        </td>
                        <td
                          style={{
                            padding: '16px',
                            fontSize: 14,
                            color: '#00000080',
                            borderRight: '1px solid #2222',
                          }}
                        >
                          {formatDate(lead.createdAt)}
                        </td>
                        <td style={{ padding: '16px', fontSize: 14, color: '#00000080' }}>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button
                              onClick={() => onEditLead(lead)}
                              style={{
                                color: '#2563eb',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                              }}
                              title="Edit Lead"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => deleteLead(lead._id)}
                              style={{
                                color: '#e11d48',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                              }}
                              title="Delete Lead"
                            >
                              <Trash2 size={18} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedLeadForReminders(lead);
                                setShowRemindersModal(true);
                                fetchRemindersByLeadId(lead._id);
                              }}
                              style={{
                                color: '#7c3aed',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                              }}
                              title="View/Add Reminders"
                            >
                              <Calendar size={18} />
                            </button>
                            <button
                              onClick={() => toggleLeadStatus(lead._id, lead.isActive)}
                              style={{
                                color: lead.isActive ? '#f59e42' : '#22c55e',
                                background: 'none',
                                border: 'none',
                                fontSize: 12,
                                cursor: 'pointer',
                              }}
                              title={lead.isActive ? 'Deactivate Lead' : 'Activate Lead'}
                            >
                              {lead.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                  {loading && leads.length > 0 && (
                    <tr>
                      <td
                        colSpan={10}
                        style={{
                          textAlign: 'center',
                          padding: '32px 16px',
                          fontSize: 14,
                          color: '#888',
                          fontWeight: 500,
                          background: '#fff',
                        }}
                      ></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {loading && leads.length > 0 && (
            <p
              style={{
                background: '#fff',
                position: 'absolute',
                bottom: 32,
                width: '94%',
                textAlign: 'center',
                fontSize: 14,
                padding: '16px 0',
                color: '#888',
                fontWeight: 500,
              }}
            >
              Loading...
            </p>
          )}
        </div>
      </section>

      {showCreateForm && (
        <CreateLeadModal
          onClose={() => setShowCreateForm(false)}
          onCreate={() => {
            fetchLeads();
            setShowCreateForm(false);
          }}
        />
      )}

      {showRemindersModal && (
        <RemindersModal
          lead={selectedLeadForReminders}
          reminders={reminders}
          onClose={() => {
            setShowRemindersModal(false);
            setSelectedLeadForReminders(null);
            setReminders([]);
          }}
          onUpdate={() => {
            if (selectedLeadForReminders) {
              fetchRemindersByLeadId(selectedLeadForReminders._id);
            } else {
              fetchAllReminders();
            }
          }}
        />
      )}
    </main>
  );
};

export default LeadTable;
