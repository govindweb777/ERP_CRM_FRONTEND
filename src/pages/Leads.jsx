// 'use client';

// import React, { useState, useEffect, useRef } from 'react';
// import { AiOutlineSearch } from 'react-icons/ai';
// import { RxTriangleDown, RxCross2 } from 'react-icons/rx';
// import { Plus, Mail, Phone, MapPin, FileText, Edit, Trash2, Filter } from 'lucide-react';

// // Define options at the top level for shared access
// const statusOptions = [
//   { id: 1, option: 'Not Sure' },
//   { id: 2, option: 'Interested' },
//   { id: 3, option: 'Not Interested' },
//   { id: 4, option: 'Follow Up' },
// ];

// const sourceOptions = [
//   { id: 1, option: 'LinkedIn' },
//   { id: 2, option: 'Facebook' },
//   { id: 3, option: 'Website' },
//   { id: 4, option: 'Referral' },
//   { id: 5, option: 'Other' },
// ];

// const LeadTable = ({ onEditLead, campaignId }) => {
//   const [leads, setLeads] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [filterActive, setFilterActive] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState([]);
//   const [sourceFilter, setSourceFilter] = useState([]);
//   const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
//   const [isSourceDropdownOpen, setIsSourceDropdownOpen] = useState(false);
//   const [selectedLeads, setSelectedLeads] = useState([]);
//   const containerRef = useRef(null);
//   const statusRef = useRef(null);
//   const sourceRef = useRef(null);

//   const VITE_FILE_BASE_URL = import.meta.env.VITE_FILE_BASE_URL || 'http://localhost:3000/';
//   const authString = localStorage.getItem('auth');
//   let token = '';
//   if (authString) {
//     try {
//       const auth = JSON.parse(authString);
//       token = auth?.current?.token || '';
//     } catch (error) {
//       console.error('Failed to parse auth from localStorage:', error);
//     }
//   }

//   const tableHeadings = [
//     'Name',
//     'Email',
//     'Contact',
//     'Source',
//     'Status',
//     'Industry',
//     'City',
//     'Created At',
//   ];

//   const fetchLeads = async () => {
//     setLoading(true);
//     try {
//       const endpoint = filterActive ? 'get-active-lead' : 'get-all';
//       const response = await fetch(`${VITE_FILE_BASE_URL}api/v1/lead/${endpoint}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       let result = await response.json();
//       if (result.success) {
//         result = result.data || [];
//         if (searchTerm) {
//           result = result.filter(
//             (lead) =>
//               lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//               lead.email.toLowerCase().includes(searchTerm.toLowerCase())
//           );
//         }
//         if (statusFilter.length > 0) {
//           result = result.filter((lead) => statusFilter.includes(lead.status));
//         }
//         if (sourceFilter.length > 0) {
//           result = result.filter((lead) => sourceFilter.includes(lead.source));
//         }
//         setLeads(result);
//       } else {
//         console.error('Failed to fetch leads:', result.message);
//       }
//     } catch (error) {
//       console.error('Error fetching leads:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = () => {
//     fetchLeads();
//   };

//   const handleStatusToggle = (item) => {
//     setStatusFilter((prev) =>
//       prev.includes(item.option)
//         ? prev.filter((opt) => opt !== item.option)
//         : [...prev, item.option]
//     );
//   };

//   const handleSourceToggle = (item) => {
//     setSourceFilter((prev) =>
//       prev.includes(item.option)
//         ? prev.filter((opt) => opt !== item.option)
//         : [...prev, item.option]
//     );
//   };

//   const handleSelectLead = (leadId) => {
//     setSelectedLeads((prev) =>
//       prev.includes(leadId) ? prev.filter((id) => id !== leadId) : [...prev, leadId]
//     );
//   };

//   const deleteLead = async (id) => {
//     if (!confirm('Are you sure you want to delete this lead?')) return;
//     setLoading(true);
//     try {
//       const response = await fetch(`${VITE_FILE_BASE_URL}api/v1/lead/delete/${id}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const result = await response.json();
//       if (result.success) {
//         fetchLeads();
//         setSelectedLeads((prev) => prev.filter((leadId) => leadId !== id));
//       } else {
//         console.error('Failed to delete lead:', result.message);
//       }
//     } catch (error) {
//       console.error('Error deleting lead:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleLeadStatus = async (id, isActive) => {
//     setLoading(true);
//     try {
//       const endpoint = isActive ? 'deactivate-lead' : 'activate-lead';
//       const response = await fetch(`${VITE_FILE_BASE_URL}api/v1/lead/${endpoint}/${id}`, {
//         method: 'PUT',
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const result = await response.json();
//       if (result.success) {
//         fetchLeads();
//       } else {
//         console.error(`Failed to ${isActive ? 'deactivate' : 'activate'} lead:`, result.message);
//       }
//     } catch (error) {
//       console.error(`Error ${isActive ? 'deactivating' : 'activating'} lead:`, error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClearFilters = () => {
//     setSearchTerm('');
//     setStatusFilter([]);
//     setSourceFilter([]);
//     fetchLeads();
//   };

//   useEffect(() => {
//     fetchLeads();
//   }, [filterActive, statusFilter, sourceFilter]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (statusRef.current && !statusRef.current.contains(event.target)) {
//         setIsStatusDropdownOpen(false);
//       }
//       if (sourceRef.current && !sourceRef.current.contains(event.target)) {
//         setIsSourceDropdownOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   return (
//     <main className="font-inter min-h-[95dvh] flex flex-col">
//       <section className="">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-lg font-semibold">Lead Management</h1>
//           <div className="flex bg-[#318FFF66] p-[3px] rounded-lg">
//             <button
//               onClick={() => setFilterActive(!filterActive)}
//               className="flex items-center space-x-1 px-2 py-2 rounded-lg text-xs font-medium cursor-pointer bg-white"
//             >
//               <Filter size={16} />
//               <span>{filterActive ? 'Show All Leads' : 'Show Active Leads'}</span>
//             </button>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg p-4 mb-6 ">
//           <div className="flex flex-wrap items-center gap-4 mb-5">
//             <div className="relative flex-grow min-w-[240px] max-w-[340px] border-2 border-black/15 rounded-lg">
//               <input
//                 type="search"
//                 placeholder="Search by Name/Email"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-11/12 px-3 py-2 placeholder-black/50 text-sm focus:outline-none focus:ring-0"
//                 onKeyDown={(e) => {
//                   if (e.key === 'Enter') handleSearch();
//                 }}
//               />
//               <AiOutlineSearch
//                 className="absolute right-3 top-1/2 transform cursor-pointer -translate-y-1/2 w-5 h-5"
//                 onClick={handleSearch}
//               />
//             </div>

//             <div className="relative" ref={statusRef}>
//               <button
//                 className="flex items-center bg-gradient-to-b from-black/0 to-black/20 p-[10px] rounded-[10px] text-sm border border-gray-300 cursor-pointer"
//                 onClick={() => setIsStatusDropdownOpen((p) => !p)}
//               >
//                 <span className="text-sm leading-0">Status</span>
//                 <RxTriangleDown
//                   size={16}
//                   className={`${
//                     isStatusDropdownOpen ? 'rotate-180' : 'rotate-0'
//                   } transition-transform duration-300 ml-3 leading-0`}
//                 />
//               </button>
//               {isStatusDropdownOpen && (
//                 <div className="absolute mt-[2px] top-full min-w-24 bg-white border shadow-sm border-black/20 z-50 max-h-48 rounded-lg">
//                   {statusOptions.map((item) => (
//                     <p
//                       key={item.id}
//                       className={`m-1 py-1 px-2 flex items-center justify-between cursor-pointer text-black text-xs ${
//                         statusFilter.includes(item.option) ? 'bg-[#E9F5F0]' : 'bg-white'
//                       }`}
//                       onClick={() => handleStatusToggle(item)}
//                     >
//                       {item.option}
//                     </p>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div className="relative" ref={sourceRef}>
//               <button
//                 className="flex items-center bg-gradient-to-b from-black/0 to-black/20 p-[10px] rounded-[10px] text-sm border border-gray-300 cursor-pointer"
//                 onClick={() => setIsSourceDropdownOpen((p) => !p)}
//               >
//                 <span className="text-sm leading-0">Source</span>
//                 <RxTriangleDown
//                   size={16}
//                   className={`${
//                     isSourceDropdownOpen ? 'rotate-180' : 'rotate-0'
//                   } transition-transform duration-300 ml-3 leading-0`}
//                 />
//               </button>
//               {isSourceDropdownOpen && (
//                 <div className="absolute mt-[2px] top-full min-w-24 bg-white border shadow-sm border-black/20 z-50 max-h-48 rounded-lg">
//                   {sourceOptions.map((item) => (
//                     <p
//                       key={item.id}
//                       className={`m-1 py-1 px-2 flex items-center justify-between cursor-pointer text-black text-xs ${
//                         sourceFilter.includes(item.option) ? 'bg-[#E9F5F0]' : 'bg-white'
//                       }`}
//                       onClick={() => handleSourceToggle(item)}
//                     >
//                       {item.option}
//                     </p>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <button
//               onClick={() => setShowCreateForm(true)}
//               className="relative px-4 py-2 rounded-lg text-sm font-medium bg-[#E96D70] text-white hover:bg-[#ff4f4f]"
//             >
//               Add Lead
//               {selectedLeads.length > 0 && (
//                 <span className="text-xs absolute -right-2 aspect-square leading-6 -top-2 bg-[#F4BB3F] rounded-full w-6 h-6">
//                   {selectedLeads.length}
//                 </span>
//               )}
//             </button>
//           </div>

//           <div className="flex flex-col sm:flex-row gap-2 sm:items-center mt-4">
//             <p className="text-sm whitespace-nowrap">
//               Showing results for {leads.length.toLocaleString() || 0} Leads
//             </p>
//             <div className="flex flex-wrap gap-2 items-center">
//               {statusFilter.map((status, i) => (
//                 <p
//                   key={`status-${i}`}
//                   className="bg-[#F4BB3F] rounded-md text-white px-2 text-xs py-1 flex items-center gap-1"
//                 >
//                   <span>{status}</span>
//                   <RxCross2
//                     className="rounded-full relative -top-[1px] border-2 p-[1px] box-content cursor-pointer"
//                     size={10}
//                     onClick={() => setStatusFilter((prev) => prev.filter((opt) => opt !== status))}
//                   />
//                 </p>
//               ))}
//               {sourceFilter.map((source, i) => (
//                 <p
//                   key={`source-${i}`}
//                   className="bg-[#F4BB3F] rounded-md text-white px-2 text-xs py-1 flex items-center gap-1"
//                 >
//                   <span>{source}</span>
//                   <RxCross2
//                     className="rounded-full relative -top-[1px] border-2 p-[1px] box-content cursor-pointer"
//                     size={10}
//                     onClick={() => setSourceFilter((prev) => prev.filter((opt) => opt !== source))}
//                   />
//                 </p>
//               ))}
//               {(searchTerm || statusFilter.length > 0 || sourceFilter.length > 0) && (
//                 <button
//                   type="button"
//                   className="flex items-center gap-x-1 ml-4 cursor-pointer"
//                   onClick={handleClearFilters}
//                 >
//                   <p className="text-sm leading-0 font-medium text-black/60">Clear filters</p>
//                   <RxCross2 size={17} className="leading-0 text-black/60" />
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="bg-[#F5F5F5] relative py-5   -mx-8 box-content flex items-center justify-center">
//           {loading && leads.length === 0 ? (
//             <p className="text-center py-10 text-black/60 animate-pulse font-medium">Loading...</p>
//           ) : (
//             <div
//               className="rounded-lg border mx-8 max-h-[430px] overflow-y-auto w-full overflow-x-auto border-[#76E4B6]"
//               ref={containerRef}
//             >
//               <table
//                 className={`min-w-full ${
//                   leads.length === 0 && !loading ? 'table-fixed w-full' : ''
//                 } border-collapse`}
//               >
//                 <thead className="bg-[#CDE4DA] sticky z-25 top-0">
//                   {leads.length === 0 && !loading ? (
//                     <tr>
//                       <th colSpan={10} className="px-4 py-3 text-xs font-semibold text-center">
//                         <p>---</p>
//                       </th>
//                     </tr>
//                   ) : (
//                     <tr>
//                       <th className="px-5 py-3 sm:sticky sm:left-0 z-50 bg-[#CDE4DA]"></th>
//                       {tableHeadings.map((heading, i) => (
//                         <th
//                           key={i}
//                           className="px-4 py-3 text-left text-xs font-semibold leading-0 tracking-wider whitespace-nowrap last:border-0 border-r border-black/20"
//                         >
//                           <span className="uppercase">{heading}</span>
//                         </th>
//                       ))}
//                       <th className="px-4 py-3 text-left text-xs font-semibold leading-0 tracking-wider whitespace-nowrap">
//                         Actions
//                       </th>
//                     </tr>
//                   )}
//                 </thead>
//                 <tbody className="bg-white divide-y divide-black/10">
//                   {loading && leads.length === 0 ? (
//                     <tr>
//                       <td colSpan="10" className="px-4 py-8 text-center">
//                         <p className="text-black/50 font-medium animate-pulse">Loading...</p>
//                       </td>
//                     </tr>
//                   ) : leads.length === 0 ? (
//                     <tr>
//                       <td colSpan="10" className="text-black/45 font-medium px-4 py-8 text-center">
//                         <p>No Results Found.</p>
//                         <p>Edit Filters to see updated results.</p>
//                       </td>
//                     </tr>
//                   ) : (
//                     leads.map((lead, index) => (
//                       <tr key={index}>
//                         <td className=" bg-white"></td>
//                         <td className=" bg-white px-4 py-4 border-r border-black/20 whitespace-nowrap">
//                           <div className="flex items-center space-x-3 w-max">
//                             <div>
//                               <div className="flex items-center space-x-1">
//                                 <span className="text-[13px] font-medium whitespace-nowrap">
//                                   {lead.name || 'N/A'}
//                                 </span>
//                               </div>
//                               <div className="flex items-center text-xs mt-1 text-black/50 space-x-1">
//                                 <Mail size={14} />
//                                 <span className="leading-0">{lead.email || 'N/A'}</span>
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-4 py-4 text-sm text-[#00000080] border-r border-black/20">
//                           {lead.email || 'N/A'}
//                         </td>
//                         <td className="px-4 py-4 text-sm text-[#00000080] border-r border-black/20">
//                           {lead.contactNo || 'N/A'}
//                         </td>
//                         <td className="px-4 py-4 text-sm text-[#00000080] border-r border-black/20">
//                           {lead.source || 'N/A'}
//                         </td>
//                         <td className="px-4 py-4 text-sm text-[#00000080] border-r border-black/20">
//                           {lead.status || 'N/A'}
//                         </td>
//                         <td className="px-4 py-4 text-sm text-[#00000080] border-r border-black/20">
//                           {lead.industry || 'N/A'}
//                         </td>
//                         <td className="px-4 py-4 text-sm text-[#00000080] border-r border-black/20">
//                           {lead.Address?.city || 'N/A'}
//                         </td>
//                         <td className="px-4 py-4 text-sm text-[#00000080] border-r border-black/20">
//                           {formatDate(lead.createdAt)}
//                         </td>
//                         <td className="px-4 py-4 text-sm text-[#00000080]">
//                           <div className="flex gap-2">
//                             <button
//                               onClick={() => onEditLead(lead)}
//                               className="text-blue-600 hover:text-blue-800"
//                               title="Edit Lead"
//                             >
//                               <Edit size={18} />
//                             </button>
//                             <button
//                               onClick={() => deleteLead(lead._id)}
//                               className="text-red-600 hover:text-red-800"
//                               title="Delete Lead"
//                             >
//                               <Trash2 size={18} />
//                             </button>
//                             <button
//                               onClick={() => toggleLeadStatus(lead._id, lead.isActive)}
//                               className={`${
//                                 lead.isActive
//                                   ? 'text-yellow-600 hover:text-yellow-800'
//                                   : 'text-green-600 hover:text-green-800'
//                               } text-xs`}
//                               title={lead.isActive ? 'Deactivate Lead' : 'Activate Lead'}
//                             >
//                               {lead.isActive ? 'Deactivate' : 'Activate'}
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                   {loading && leads.length > 0 && (
//                     <tr>
//                       <td
//                         colSpan={10}
//                         className="text-center py-8 text-sm text-black/50 font-medium bg-white"
//                       ></td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//           {loading && leads.length > 0 && (
//             <p className="bg-white absolute bottom-8 w-[94%] text-center text-sm py-4 text-black/50 font-medium">
//               Loading...
//             </p>
//           )}
//         </div>
//       </section>

//       {showCreateForm && (
//         <CreateLeadModal
//           onClose={() => setShowCreateForm(false)}
//           onCreate={() => {
//             fetchLeads();
//             setShowCreateForm(false);
//           }}
//         />
//       )}
//     </main>
//   );
// };

// const CreateLeadModal = ({ onClose, onCreate }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     contactNo: '',
//     source: 'LinkedIn',
//     status: 'Not Sure',
//     remark: '',
//     notes: '',
//     industry: '',
//     Address: { detail: '', pinCode: '', city: '', country: 'India' },
//     documents: null,
//   });
//   const [formError, setFormError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const VITE_FILE_BASE_URL = import.meta.env.VITE_FILE_BASE_URL || 'http://localhost:3000/';
//   const authString = localStorage.getItem('auth');
//   let token = '';
//   if (authString) {
//     try {
//       const auth = JSON.parse(authString);
//       token = auth?.current?.token || '';
//     } catch (error) {
//       console.error('Failed to parse auth from localStorage:', error);
//     }
//   }

//   const createLead = async () => {
//     if (
//       !formData.name ||
//       !formData.email ||
//       !formData.contactNo ||
//       !formData.source ||
//       !formData.documents
//     ) {
//       setFormError('Name, Email, Contact Number, Source, and Documents are required');
//       return;
//     }

//     setLoading(true);
//     setFormError('');
//     try {
//       const formDataToSend = new FormData();
//       Object.entries(formData).forEach(([key, value]) => {
//         if (key === 'Address') {
//           formDataToSend.append('Address', JSON.stringify(value));
//         } else if (key === 'documents' && value) {
//           formDataToSend.append('documents', value);
//         } else if (value && key !== 'documents') {
//           formDataToSend.append(key, value);
//         }
//       });

//       const response = await fetch(`${VITE_FILE_BASE_URL}api/v1/lead/create`, {
//         method: 'POST',
//         headers: { Authorization: `Bearer ${token}` },
//         body: formDataToSend,
//       });

//       const result = await response.json();
//       if (result.success) {
//         onCreate();
//       } else {
//         setFormError(result.message || 'Failed to create lead');
//       }
//     } catch (error) {
//       console.error('Error creating lead:', error);
//       setFormError('Failed to create lead');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === 'documents') {
//       setFormData((prev) => ({ ...prev, documents: files[0] }));
//     } else if (name.startsWith('Address.')) {
//       const addressField = name.split('.')[1];
//       setFormData((prev) => ({
//         ...prev,
//         Address: { ...prev.Address, [addressField]: value },
//       }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="p-6 border-b flex justify-between items-center">
//           <h2 className="text-2xl font-bold text-gray-900">Create New Lead</h2>
//           <button
//             onClick={onClose}
//             className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
//           >
//             <RxCross2 size={25} />
//           </button>
//         </div>
//         <div className="p-6 space-y-6">
//           {formError && (
//             <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
//               <span className="text-red-800">{formError}</span>
//             </div>
//           )}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="Enter full name"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="Enter email address"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Contact Number *
//               </label>
//               <input
//                 type="tel"
//                 name="contactNo"
//                 value={formData.contactNo}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="Enter contact number"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Source *</label>
//               <select
//                 name="source"
//                 value={formData.source}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 {sourceOptions.map((opt) => (
//                   <option key={opt.id} value={opt.option}>
//                     {opt.option}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
//               <select
//                 name="status"
//                 value={formData.status}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 {statusOptions.map((opt) => (
//                   <option key={opt.id} value={opt.option}>
//                     {opt.option}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
//               <input
//                 type="text"
//                 name="industry"
//                 value={formData.industry}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="Enter industry"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Remark</label>
//               <input
//                 type="text"
//                 name="remark"
//                 value={formData.remark}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="Enter remark"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
//               <input
//                 type="text"
//                 name="notes"
//                 value={formData.notes}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="Enter notes"
//               />
//             </div>
//           </div>
//           <div className="space-y-4">
//             <h3 className="text-lg font-medium text-gray-900">Address Information</h3>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Address Detail</label>
//               <input
//                 type="text"
//                 name="Address.detail"
//                 value={formData.Address.detail}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="House no, Street, etc."
//               />
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Pin Code</label>
//                 <input
//                   type="text"
//                   name="Address.pinCode"
//                   value={formData.Address.pinCode}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Enter pin code"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
//                 <input
//                   type="text"
//                   name="Address.city"
//                   value={formData.Address.city}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Enter city"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
//                 <input
//                   type="text"
//                   name="Address.country"
//                   value={formData.Address.country}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Enter country"
//                 />
//               </div>
//             </div>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Documents *</label>
//             <input
//               type="file"
//               name="documents"
//               onChange={handleInputChange}
//               accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
//               required
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//             <p className="text-sm text-gray-500 mt-1">Upload PDF, DOC, or image files (Required)</p>
//           </div>
//           <div className="flex gap-4 pt-6 border-t">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               type="button"
//               onClick={createLead}
//               disabled={loading}
//               className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? 'Creating...' : 'Create Lead'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const EditLeadModal = ({ lead, onClose, onUpdate }) => {
//   const [formData, setFormData] = useState({
//     name: lead?.name || '',
//     email: lead?.email || '',
//     contactNo: lead?.contactNo || '',
//     source: lead?.source || 'LinkedIn',
//     status: lead?.status || 'Not Sure',
//     remark: lead?.remark || '',
//     notes: lead?.notes || '',
//     industry: lead?.industry || '',
//     Address: lead?.Address || { detail: '', pinCode: '', city: '', country: 'India' },
//     documents: null,
//   });
//   const [formError, setFormError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const VITE_FILE_BASE_URL = import.meta.env.VITE_FILE_BASE_URL || 'http://localhost:3000/';
//   const authString = localStorage.getItem('auth');
//   let token = '';
//   if (authString) {
//     try {
//       const auth = JSON.parse(authString);
//       token = auth?.current?.token || '';
//     } catch (error) {
//       console.error('Failed to parse auth from localStorage:', error);
//     }
//   }

//   const updateLead = async () => {
//     if (!formData.name || !formData.email || !formData.contactNo || !formData.source) {
//       setFormError('Name, Email, Contact Number, and Source are required');
//       return;
//     }

//     setLoading(true);
//     setFormError('');
//     try {
//       const formDataToSend = new FormData();
//       Object.entries(formData).forEach(([key, value]) => {
//         if (key === 'Address') {
//           formDataToSend.append('Address', JSON.stringify(value));
//         } else if (key === 'documents' && value) {
//           formDataToSend.append('documents', value);
//         } else if (value && key !== 'documents') {
//           formDataToSend.append(key, value);
//         }
//       });

//       const response = await fetch(`${VITE_FILE_BASE_URL}api/v1/lead/update/${lead._id}`, {
//         method: 'PUT',
//         headers: { Authorization: `Bearer ${token}` },
//         body: formDataToSend,
//       });

//       const result = await response.json();
//       if (result.success) {
//         onUpdate();
//         onClose();
//       } else {
//         setFormError(result.message || 'Failed to update lead');
//       }
//     } catch (error) {
//       console.error('Error updating lead:', error);
//       setFormError('Failed to update lead');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === 'documents') {
//       setFormData((prev) => ({ ...prev, documents: files[0] }));
//     } else if (name.startsWith('Address.')) {
//       const addressField = name.split('.')[1];
//       setFormData((prev) => ({
//         ...prev,
//         Address: { ...prev.Address, [addressField]: value },
//       }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="p-6 border-b flex justify-between items-center">
//           <h2 className="text-2xl font-bold text-gray-900">Edit Lead</h2>
//           <button
//             onClick={onClose}
//             className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
//           >
//             <RxCross2 size={25} />
//           </button>
//         </div>
//         <div className="p-6 space-y-6">
//           {formError && (
//             <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
//               <span className="text-red-800">{formError}</span>
//             </div>
//           )}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="Enter full name"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="Enter email address"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Contact Number *
//               </label>
//               <input
//                 type="tel"
//                 name="contactNo"
//                 value={formData.contactNo}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="Enter contact number"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Source *</label>
//               <select
//                 name="source"
//                 value={formData.source}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 {sourceOptions.map((opt) => (
//                   <option key={opt.id} value={opt.option}>
//                     {opt.option}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
//               <select
//                 name="status"
//                 value={formData.status}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 {statusOptions.map((opt) => (
//                   <option key={opt.id} value={opt.option}>
//                     {opt.option}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
//               <input
//                 type="text"
//                 name="industry"
//                 value={formData.industry}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="Enter industry"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Remark</label>
//               <input
//                 type="text"
//                 name="remark"
//                 value={formData.remark}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="Enter remark"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
//               <input
//                 type="text"
//                 name="notes"
//                 value={formData.notes}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="Enter notes"
//               />
//             </div>
//           </div>
//           <div className="space-y-4">
//             <h3 className="text-lg font-medium text-gray-900">Address Information</h3>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Address Detail</label>
//               <input
//                 type="text"
//                 name="Address.detail"
//                 value={formData.Address.detail}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="House no, Street, etc."
//               />
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Pin Code</label>
//                 <input
//                   type="text"
//                   name="Address.pinCode"
//                   value={formData.Address.pinCode}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Enter pin code"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
//                 <input
//                   type="text"
//                   name="Address.city"
//                   value={formData.Address.city}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Enter city"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
//                 <input
//                   type="text"
//                   name="Address.country"
//                   value={formData.Address.country}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Enter country"
//                 />
//               </div>
//             </div>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Documents</label>
//             <input
//               type="file"
//               name="documents"
//               onChange={handleInputChange}
//               accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//             {lead.documents && (
//               <a
//                 href={lead.documents}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block"
//               >
//                 View Current Document
//               </a>
//             )}
//           </div>
//           <div className="flex gap-4 pt-6 border-t">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               type="button"
//               onClick={updateLead}
//               disabled={loading}
//               className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? 'Updating...' : 'Update Lead'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const LeadManagementSystem = () => {
//   const [selectedLead, setSelectedLead] = useState(null);

//   return (
//     <div>
//       <LeadTable onEditLead={setSelectedLead} campaignId="123" />
//       {selectedLead && (
//         <EditLeadModal
//           lead={selectedLead}
//           onClose={() => setSelectedLead(null)}
//           onUpdate={() => {
//             setSelectedLead(null);
//             document.querySelector('table')?.closest('main')?.fetchLeads?.();
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default LeadManagementSystem;

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { RxTriangleDown, RxCross2 } from 'react-icons/rx';
import { Plus, Mail, Phone, MapPin, FileText, Edit, Trash2, Filter, Calendar } from 'lucide-react';

// Define options at the top level for shared access
const statusOptions = [
  { id: 1, option: 'Not Sure' },
  { id: 2, option: 'Completed' },
  { id: 3, option: 'Under Conversation' },
  { id: 4, option: 'Deal Closed' },
  {id:5,option:'Under Process'}
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

  return (
    <main className="font-inter min-h-[95dvh] flex flex-col">
      <section className="">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-lg font-semibold">Lead Management</h1>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowRemindersModal(true);
                fetchAllReminders();
              }}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
            >
              Show All Reminders
            </button>
            <div className="flex bg-[#318FFF66] p-[3px] rounded-lg">
              <button
                onClick={() => setFilterActive(!filterActive)}
                className="flex items-center space-x-1 px-2 py-2 rounded-lg text-xs font-medium cursor-pointer bg-white"
              >
                <Filter size={16} />
                <span>{filterActive ? 'Show All Leads' : 'Show Active Leads'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4 mb-5">
            <div className="relative flex-grow min-w-[240px] max-w-[340px] border-2 border-black/15 rounded-lg">
              <input
                type="search"
                placeholder="Search by Name/Email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-11/12 px-3 py-2 placeholder-black/50 text-sm focus:outline-none focus:ring-0"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
              />
              <AiOutlineSearch
                className="absolute right-3 top-1/2 transform cursor-pointer -translate-y-1/2 w-5 h-5"
                onClick={handleSearch}
              />
            </div>

            <div className="relative" ref={statusRef}>
              <button
                className="flex items-center bg-gradient-to-b from-black/0 to-black/20 p-[10px] rounded-[10px] text-sm border border-gray-300 cursor-pointer"
                onClick={() => setIsStatusDropdownOpen((p) => !p)}
              >
                <span className="text-sm leading-0">Status</span>
                <RxTriangleDown
                  size={16}
                  className={`${
                    isStatusDropdownOpen ? 'rotate-180' : 'rotate-0'
                  } transition-transform duration-300 ml-3 leading-0`}
                />
              </button>
              {isStatusDropdownOpen && (
                <div className="absolute mt-[2px] top-full min-w-24 bg-white border shadow-sm border-black/20 z-50 max-h-48 rounded-lg">
                  {statusOptions.map((item) => (
                    <p
                      key={item.id}
                      className={`m-1 py-1 px-2 flex items-center justify-between cursor-pointer text-black text-xs ${
                        statusFilter.includes(item.option) ? 'bg-[#E9F5F0]' : 'bg-white'
                      }`}
                      onClick={() => handleStatusToggle(item)}
                    >
                      {item.option}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <div className="relative" ref={sourceRef}>
              <button
                className="flex items-center bg-gradient-to-b from-black/0 to-black/20 p-[10px] rounded-[10px] text-sm border border-gray-300 cursor-pointer"
                onClick={() => setIsSourceDropdownOpen((p) => !p)}
              >
                <span className="text-sm leading-0">Source</span>
                <RxTriangleDown
                  size={16}
                  className={`${
                    isSourceDropdownOpen ? 'rotate-180' : 'rotate-0'
                  } transition-transform duration-300 ml-3 leading-0`}
                />
              </button>
              {isSourceDropdownOpen && (
                <div className="absolute mt-[2px] top-full min-w-24 bg-white border shadow-sm border-black/20 z-50 max-h-48 rounded-lg">
                  {sourceOptions.map((item) => (
                    <p
                      key={item.id}
                      className={`m-1 py-1 px-2 flex items-center justify-between cursor-pointer text-black text-xs ${
                        sourceFilter.includes(item.option) ? 'bg-[#E9F5F0]' : 'bg-white'
                      }`}
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
              className="relative px-4 py-2 rounded-lg text-sm font-medium bg-[#E96D70] text-white hover:bg-[#ff4f4f]"
            >
              Add Lead
              {selectedLeads.length > 0 && (
                <span className="text-xs absolute -right-2 aspect-square leading-6 -top-2 bg-[#F4BB3F] rounded-full w-6 h-6">
                  {selectedLeads.length}
                </span>
              )}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:items-center mt-4">
            <p className="text-sm whitespace-nowrap">
              Showing results for {leads.length.toLocaleString() || 0} Leads
            </p>
            <div className="flex flex-wrap gap-2 items-center">
              {statusFilter.map((status, i) => (
                <p
                  key={`status-${i}`}
                  className="bg-[#F4BB3F] rounded-md text-white px-2 text-xs py-1 flex items-center gap-1"
                >
                  <span>{status}</span>
                  <RxCross2
                    className="rounded-full relative -top-[1px] border-2 p-[1px] box-content cursor-pointer"
                    size={10}
                    onClick={() => setStatusFilter((prev) => prev.filter((opt) => opt !== status))}
                  />
                </p>
              ))}
              {sourceFilter.map((source, i) => (
                <p
                  key={`source-${i}`}
                  className="bg-[#F4BB3F] rounded-md text-white px-2 text-xs py-1 flex items-center gap-1"
                >
                  <span>{source}</span>
                  <RxCross2
                    className="rounded-full relative -top-[1px] border-2 p-[1px] box-content cursor-pointer"
                    size={10}
                    onClick={() => setSourceFilter((prev) => prev.filter((opt) => opt !== source))}
                  />
                </p>
              ))}
              {(searchTerm || statusFilter.length > 0 || sourceFilter.length > 0) && (
                <button
                  type="button"
                  className="flex items-center gap-x-1 ml-4 cursor-pointer"
                  onClick={handleClearFilters}
                >
                  <p className="text-sm leading-0 font-medium text-black/60">Clear filters</p>
                  <RxCross2 size={17} className="leading-0 text-black/60" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-[#F5F5F5] relative py-5 -mx-8 box-content flex items-center justify-center">
          {loading && leads.length === 0 ? (
            <p className="text-center py-10 text-black/60 animate-pulse font-medium">Loading...</p>
          ) : (
            <div
              className="rounded-lg border mx-8 max-h-[430px] overflow-y-auto w-full overflow-x-auto border-[#76E4B6]"
              ref={containerRef}
            >
              <table
                className={`min-w-full ${
                  leads.length === 0 && !loading ? 'table-fixed w-full' : ''
                } border-collapse`}
              >
                <thead className="bg-[#CDE4DA] sticky z-25 top-0">
                  {leads.length === 0 && !loading ? (
                    <tr>
                      <th colSpan={10} className="px-4 py-3 text-xs font-semibold text-center">
                        <p>---</p>
                      </th>
                    </tr>
                  ) : (
                    <tr>
                      <th className="px-5 py-3 sm:sticky sm:left-0 z-50 bg-[#CDE4DA]"></th>
                      {tableHeadings.map((heading, i) => (
                        <th
                          key={i}
                          className="px-4 py-3 text-left text-xs font-semibold leading-0 tracking-wider whitespace-nowrap last:border-0 border-r border-black/20"
                        >
                          <span className="uppercase">{heading}</span>
                        </th>
                      ))}
                      <th className="px-4 py-3 text-left text-xs font-semibold leading-0 tracking-wider whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  )}
                </thead>
                <tbody className="bg-white divide-y divide-black/10">
                  {loading && leads.length === 0 ? (
                    <tr>
                      <td colSpan="10" className="px-4 py-8 text-center">
                        <p className="text-black/50 font-medium animate-pulse">Loading...</p>
                      </td>
                    </tr>
                  ) : leads.length === 0 ? (
                    <tr>
                      <td colSpan="10" className="text-black/45 font-medium px-4 py-8 text-center">
                        <p>No Results Found.</p>
                        <p>Edit Filters to see updated results.</p>
                      </td>
                    </tr>
                  ) : (
                    leads.map((lead, index) => (
                      <tr key={index}>
                        <td className="bg-white"></td>
                        <td className="bg-white px-4 py-4 border-r border-black/20 whitespace-nowrap">
                          <div className="flex items-center space-x-3 w-max">
                            <div>
                              <div className="flex items-center space-x-1">
                                <span className="text-[13px] font-medium whitespace-nowrap">
                                  {lead.name || 'N/A'}
                                </span>
                              </div>
                              <div className="flex items-center text-xs mt-1 text-black/50 space-x-1">
                                <Mail size={14} />
                                <span className="leading-0">{lead.email || 'N/A'}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-[#00000080] border-r border-black/20">
                          {lead.email || 'N/A'}
                        </td>
                        <td className="px-4 py-4 text-sm text-[#00000080] border-r border-black/20">
                          {lead.contactNo || 'N/A'}
                        </td>
                        <td className="px-4 py-4 text-sm text-[#00000080] border-r border-black/20">
                          {lead.source || 'N/A'}
                        </td>
                        <td className="px-4 py-4 text-sm text-[#00000080] border-r border-black/20">
                          {lead.status || 'N/A'}
                        </td>
                        <td className="px-4 py-4 text-sm text-[#00000080] border-r border-black/20">
                          {lead.industry || 'N/A'}
                        </td>
                        <td className="px-4 py-4 text-sm text-[#00000080] border-r border-black/20">
                          {lead.Address?.city || 'N/A'}
                        </td>
                        <td className="px-4 py-4 text-sm text-[#00000080] border-r border-black/20">
                          {formatDate(lead.createdAt)}
                        </td>
                        <td className="px-4 py-4 text-sm text-[#00000080]">
                          <div className="flex gap-2">
                            <button
                              onClick={() => onEditLead(lead)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Edit Lead"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => deleteLead(lead._id)}
                              className="text-red-600 hover:text-red-800"
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
                              className="text-purple-600 hover:text-purple-800"
                              title="View/Add Reminders"
                            >
                              <Calendar size={18} />
                            </button>
                            <button
                              onClick={() => toggleLeadStatus(lead._id, lead.isActive)}
                              className={`${
                                lead.isActive
                                  ? 'text-yellow-600 hover:text-yellow-800'
                                  : 'text-green-600 hover:text-green-800'
                              } text-xs`}
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
                        className="text-center py-8 text-sm text-black/50 font-medium bg-white"
                      ></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {loading && leads.length > 0 && (
            <p className="bg-white absolute bottom-8 w-[94%] text-center text-sm py-4 text-black/50 font-medium">
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

const CreateLeadModal = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNo: '',
    source: 'LinkedIn',
    status: 'Not Sure',
    remark: '',
    notes: '',
    industry: '',
    Address: { detail: '', pinCode: '', city: '', country: 'India' },
    documents: null,
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

  const createLead = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.contactNo ||
      !formData.source ||
      !formData.documents
    ) {
      setFormError('Name, Email, Contact Number, Source, and Documents are required');
      return;
    }

    setLoading(true);
    setFormError('');
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'Address') {
          formDataToSend.append('Address', JSON.stringify(value));
        } else if (key === 'documents' && value) {
          formDataToSend.append('documents', value);
        } else if (value && key !== 'documents') {
          formDataToSend.append(key, value);
        }
      });

      const response = await fetch(`${VITE_FILE_BASE_URL}api/v1/lead/create`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      });

      const result = await response.json();
      if (result.success) {
        onCreate();
      } else {
        setFormError(result.message || 'Failed to create lead');
      }
    } catch (error) {
      console.error('Error creating lead:', error);
      setFormError('Failed to create lead');
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Create New Lead</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <RxCross2 size={25} />
          </button>
        </div>
        <div className="p-6 space-y-6">
          {formError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
              <span className="text-red-800">{formError}</span>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter email address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number *
              </label>
              <input
                type="tel"
                name="contactNo"
                value={formData.contactNo}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter contact number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Source *</label>
              <select
                name="source"
                value={formData.source}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sourceOptions.map((opt) => (
                  <option key={opt.id} value={opt.option}>
                    {opt.option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.id} value={opt.option}>
                    {opt.option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter industry"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Remark</label>
              <input
                type="text"
                name="remark"
                value={formData.remark}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter remark"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <input
                type="text"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter notes"
              />
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Address Information</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address Detail</label>
              <input
                type="text"
                name="Address.detail"
                value={formData.Address.detail}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="House no, Street, etc."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pin Code</label>
                <input
                  type="text"
                  name="Address.pinCode"
                  value={formData.Address.pinCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter pin code"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  name="Address.city"
                  value={formData.Address.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter city"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <input
                  type="text"
                  name="Address.country"
                  value={formData.Address.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter country"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Documents *</label>
            <input
              type="file"
              name="documents"
              onChange={handleInputChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">Upload PDF, DOC, or image files (Required)</p>
          </div>
          <div className="flex gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={createLead}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Lead'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

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
    Address: lead?.Address || { detail: '', pinCode: '', city: '', country: 'India' },
    documents: null,
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

  const updateLead = async () => {
    if (!formData.name || !formData.email || !formData.contactNo || !formData.source) {
      setFormError('Name, Email, Contact Number, and Source are required');
      return;
    }

    setLoading(true);
    setFormError('');
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'Address') {
          formDataToSend.append('Address', JSON.stringify(value));
        } else if (key === 'documents' && value) {
          formDataToSend.append('documents', value);
        } else if (value && key !== 'documents') {
          formDataToSend.append(key, value);
        }
      });

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
        setFormError(result.message || 'Failed to update lead');
      }
    } catch (error) {
      console.error('Error updating lead:', error);
      setFormError('Failed to update lead');
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Edit Lead</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <RxCross2 size={25} />
          </button>
        </div>
        <div className="p-6 space-y-6">
          {formError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
              <span className="text-red-800">{formError}</span>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter email address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number *
              </label>
              <input
                type="tel"
                name="contactNo"
                value={formData.contactNo}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter contact number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Source *</label>
              <select
                name="source"
                value={formData.source}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sourceOptions.map((opt) => (
                  <option key={opt.id} value={opt.option}>
                    {opt.option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.id} value={opt.option}>
                    {opt.option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter industry"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Remark</label>
              <input
                type="text"
                name="remark"
                value={formData.remark}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter remark"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <input
                type="text"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter notes"
              />
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Address Information</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address Detail</label>
              <input
                type="text"
                name="Address.detail"
                value={formData.Address.detail}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="House no, Street, etc."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pin Code</label>
                <input
                  type="text"
                  name="Address.pinCode"
                  value={formData.Address.pinCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter pin code"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  name="Address.city"
                  value={formData.Address.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter city"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <input
                  type="text"
                  name="Address.country"
                  value={formData.Address.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter country"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Documents</label>
            <input
              type="file"
              name="documents"
              onChange={handleInputChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {lead.documents && (
              <a
                href={lead.documents}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block"
              >
                View Current Document
              </a>
            )}
          </div>
          <div className="flex gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={updateLead}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Lead'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {lead ? `Reminders for ${lead.name}` : 'All Reminders'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <RxCross2 size={25} />
          </button>
        </div>
        <div className="p-6 space-y-6">
          {formError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
              <span className="text-red-800">{formError}</span>
            </div>
          )}
          {lead && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Add New Reminder</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter reminder title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={createReminder}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Add Reminder'}
              </button>
            </div>
          )}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Reminders List</h3>
            {reminders.length === 0 ? (
              <p className="text-gray-500">No reminders found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead className="bg-[#CDE4DA]">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Title</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Time</th>
                      {lead ? null : (
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
                          Lead Name
                        </th>
                      )}
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-black/10">
                    {reminders.map((reminder) => (
                      <tr key={reminder._id}>
                        <td className="px-4 py-4 text-sm">{reminder.title}</td>
                        <td className="px-4 py-4 text-sm">
                          {new Date(reminder.date).toLocaleDateString('en-US')}
                        </td>
                        <td className="px-4 py-4 text-sm">{reminder.time}</td>
                        {lead ? null : (
                          <td className="px-4 py-4 text-sm">{reminder.leadId?.name || 'N/A'}</td>
                        )}
                        <td className="px-4 py-4 text-sm">
                          <button
                            onClick={() => deleteReminder(reminder._id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete Reminder"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="flex gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LeadManagementSystem = () => {
  const [selectedLead, setSelectedLead] = useState(null);

  return (
    <div>
      <LeadTable onEditLead={setSelectedLead} campaignId="123" />
      {selectedLead && (
        <EditLeadModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdate={() => {
            setSelectedLead(null);
            document.querySelector('table')?.closest('main')?.fetchLeads?.();
          }}
        />
      )}
    </div>
  );
};

export default LeadManagementSystem;
