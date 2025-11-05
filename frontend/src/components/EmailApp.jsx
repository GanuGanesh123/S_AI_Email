import React, { useState, useEffect } from 'react';
import { Mail, Send, Inbox, Archive, Trash2, Star, Search, Plus, X, Paperclip, Clock, CheckCircle } from 'lucide-react';

const EmailApp = () => {
  const [emails, setEmails] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('inbox');
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [showCompose, setShowCompose] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [composeForm, setComposeForm] = useState({
    to: '',
    subject: '',
    body: ''
  });

  // Initialize with sample data
  useEffect(() => {
    const sampleEmails = [
      {
        id: 1,
        from: 'john.doe@example.com',
        to: 'me@myemail.com',
        subject: 'Welcome to our platform!',
        body: 'Hi there! Welcome to our email service. We\'re excited to have you on board.',
        date: new Date('2024-11-03T10:30:00'),
        folder: 'inbox',
        starred: false,
        read: false
      },
      {
        id: 2,
        from: 'notifications@service.com',
        to: 'me@myemail.com',
        subject: 'Your weekly summary',
        body: 'Here\'s what happened this week in your account...',
        date: new Date('2024-11-02T14:20:00'),
        folder: 'inbox',
        starred: true,
        read: true
      },
      {
        id: 3,
        from: 'me@myemail.com',
        to: 'client@business.com',
        subject: 'Re: Project proposal',
        body: 'Thank you for the proposal. I\'ve reviewed it and have some feedback...',
        date: new Date('2024-11-01T09:15:00'),
        folder: 'sent',
        starred: false,
        read: true
      }
    ];
    setEmails(sampleEmails);
  }, []);

  const filteredEmails = emails.filter(email => {
    const matchesFolder = email.folder === selectedFolder;
    const matchesSearch = searchQuery === '' || 
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.body.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const handleCompose = () => {
    setShowCompose(true);
    setSelectedEmail(null);
  };

  const handleSendEmail = () => {
    if (!composeForm.to || !composeForm.subject) {
      alert('Please fill in recipient and subject');
      return;
    }

    const newEmail = {
      id: emails.length + 1,
      from: 'me@myemail.com',
      to: composeForm.to,
      subject: composeForm.subject,
      body: composeForm.body,
      date: new Date(),
      folder: 'sent',
      starred: false,
      read: true
    };

    setEmails([...emails, newEmail]);
    setComposeForm({ to: '', subject: '', body: '' });
    setShowCompose(false);
    setSelectedFolder('sent');
  };

  const handleDeleteEmail = (emailId) => {
    const email = emails.find(e => e.id === emailId);
    if (email.folder === 'trash') {
      setEmails(emails.filter(e => e.id !== emailId));
    } else {
      setEmails(emails.map(e => 
        e.id === emailId ? { ...e, folder: 'trash' } : e
      ));
    }
    setSelectedEmail(null);
  };

  const handleStarEmail = (emailId) => {
    setEmails(emails.map(e => 
      e.id === emailId ? { ...e, starred: !e.starred } : e
    ));
  };

  const handleArchiveEmail = (emailId) => {
    setEmails(emails.map(e => 
      e.id === emailId ? { ...e, folder: 'archive' } : e
    ));
    setSelectedEmail(null);
  };

  const handleMarkAsRead = (emailId) => {
    setEmails(emails.map(e => 
      e.id === emailId ? { ...e, read: true } : e
    ));
  };

  const formatDate = (date) => {
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / 3600000);
    
    if (hours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getFolderCount = (folder) => {
    return emails.filter(e => e.folder === folder).length;
  };

  const getUnreadCount = () => {
    return emails.filter(e => e.folder === 'inbox' && !e.read).length;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            <Mail className="w-6 h-6" />
            MailBox
          </h1>
        </div>
        
        <div className="p-4">
          <button
            onClick={handleCompose}
            className="w-full bg-blue-600 text-white rounded-lg py-3 px-4 flex items-center justify-center gap-2 hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
            Compose
          </button>
        </div>

        <nav className="flex-1 px-2">
          <button
            onClick={() => setSelectedFolder('inbox')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition ${
              selectedFolder === 'inbox' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
            }`}
          >
            <Inbox className="w-5 h-5" />
            <span className="flex-1 text-left">Inbox</span>
            {getUnreadCount() > 0 && (
              <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                {getUnreadCount()}
              </span>
            )}
          </button>

          <button
            onClick={() => setSelectedFolder('sent')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition ${
              selectedFolder === 'sent' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
            }`}
          >
            <Send className="w-5 h-5" />
            <span className="flex-1 text-left">Sent</span>
            <span className="text-gray-400 text-sm">{getFolderCount('sent')}</span>
          </button>

          <button
            onClick={() => setSelectedFolder('archive')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition ${
              selectedFolder === 'archive' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
            }`}
          >
            <Archive className="w-5 h-5" />
            <span className="flex-1 text-left">Archive</span>
            <span className="text-gray-400 text-sm">{getFolderCount('archive')}</span>
          </button>

          <button
            onClick={() => setSelectedFolder('trash')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition ${
              selectedFolder === 'trash' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
            }`}
          >
            <Trash2 className="w-5 h-5" />
            <span className="flex-1 text-left">Trash</span>
            <span className="text-gray-400 text-sm">{getFolderCount('trash')}</span>
          </button>
        </nav>
      </div>

      {/* Email List */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredEmails.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Mail className="w-16 h-16 mb-4" />
              <p>No emails in {selectedFolder}</p>
            </div>
          ) : (
            filteredEmails.map(email => (
              <div
                key={email.id}
                onClick={() => {
                  setSelectedEmail(email);
                  handleMarkAsRead(email.id);
                  setShowCompose(false);
                }}
                className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition ${
                  selectedEmail?.id === email.id ? 'bg-blue-50' : ''
                } ${!email.read ? 'bg-blue-50/30' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStarEmail(email.id);
                    }}
                    className="mt-1"
                  >
                    <Star className={`w-5 h-5 ${email.starred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-sm truncate ${!email.read ? 'font-semibold' : ''}`}>
                        {selectedFolder === 'sent' ? email.to : email.from}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">{formatDate(email.date)}</span>
                    </div>
                    <p className={`text-sm truncate mb-1 ${!email.read ? 'font-semibold' : ''}`}>
                      {email.subject}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{email.body}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Email Content / Compose */}
      <div className="flex-1 bg-white flex flex-col">
        {showCompose ? (
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold">New Message</h2>
              <button onClick={() => setShowCompose(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                  <input
                    type="email"
                    value={composeForm.to}
                    onChange={(e) => setComposeForm({ ...composeForm, to: e.target.value })}
                    placeholder="recipient@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={composeForm.subject}
                    onChange={(e) => setComposeForm({ ...composeForm, subject: e.target.value })}
                    placeholder="Email subject"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    value={composeForm.body}
                    onChange={(e) => setComposeForm({ ...composeForm, body: e.target.value })}
                    placeholder="Write your message here..."
                    rows="12"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex gap-2">
              <button
                onClick={handleSendEmail}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
              <button
                onClick={() => setShowCompose(false)}
                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : selectedEmail ? (
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold flex-1">{selectedEmail.subject}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleArchiveEmail(selectedEmail.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                    title="Archive"
                  >
                    <Archive className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteEmail(selectedEmail.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {selectedEmail.from[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{selectedEmail.from}</p>
                  <p className="text-sm text-gray-500">to {selectedEmail.to}</p>
                </div>
                <span className="text-sm text-gray-500">{formatDate(selectedEmail.date)}</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="whitespace-pre-wrap">{selectedEmail.body}</div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <Mail className="w-24 h-24 mx-auto mb-4" />
              <p className="text-lg">Select an email to read</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailApp;