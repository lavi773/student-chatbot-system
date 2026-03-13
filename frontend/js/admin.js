class AdminPanel {
    constructor() {
        this.loginModal = document.getElementById('loginModal');
        this.adminDashboard = document.getElementById('adminDashboard');
        this.loginForm = document.getElementById('loginForm');
        this.addAnswerForm = document.getElementById('addAnswerForm');
        
        // Admin credentials (CHANGE THESE FOR PRODUCTION)
        this.adminCredentials = {
            username: 'admin',
            password: 'admin123'
        };
        
        this.isLoggedIn = false;
        this.init();
    }

    init() {
        // Login form
        this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        
        // Admin form
        this.addAnswerForm.addEventListener('submit', (e) => this.handleAddAnswer(e));
        
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => this.switchSection(e));
        });
        
        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
        
        // Load initial data
        this.loadStats();
        this.loadInvalidQueries();
    }

    handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (username === this.adminCredentials.username && 
            password === this.adminCredentials.password) {
            
            this.isLoggedIn = true;
            this.loginModal.style.display = 'none';
            this.adminDashboard.style.display = 'flex';
            
            // Load dashboard data
            this.loadStats();
            this.loadInvalidQueries();
            
            // Show success message
            this.showNotification('✅ Login successful!', 'success');
        } else {
            this.showNotification('❌ Invalid credentials!', 'error');
            document.getElementById('password').value = '';
        }
    }

    switchSection(e) {
        e.preventDefault();
        
        // Update active nav
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        e.currentTarget.classList.add('active');
        
        // Show section
        const section = e.currentTarget.dataset.section;
        document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
        document.getElementById(section).classList.add('active');
        
        // Load section data
        if (section === 'invalid') {
            this.loadInvalidQueries();
        } else if (section === 'dashboard') {
            this.loadStats();
        }
    }

    async loadStats() {
        try {
            const response = await fetch('http://localhost:5000/stats');
            const data = await response.json();
            
            document.getElementById('totalQueries').textContent = data.invalid_queries || 0;
            document.getElementById('invalidQueries').textContent = data.invalid_queries || 0;
        } catch (error) {
            console.error('Stats load error:', error);
        }
    }

    async loadInvalidQueries() {
        try {
            const response = await fetch('http://localhost:5000/get_invalid');
            const data = await response.json();
            
            const tbody = document.querySelector('#invalidTable tbody');
            tbody.innerHTML = '';
            
            data.queries.forEach((query, index) => {
                const row = tbody.insertRow();
                row.innerHTML = `
                    <td>${query.query}</td>
                    <td>${new Date(query.timestamp).toLocaleString()}</td>
                    <td>
                        <button class="btn-small btn-delete" onclick="admin.deleteQuery(${index})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </td>
                `;
            });
        } catch (error) {
            console.error('Invalid queries load error:', error);
            this.showNotification('Failed to load invalid queries', 'error');
        }
    }

    async handleAddAnswer(e) {
        e.preventDefault();
        
        const keywords = document.getElementById('keywords').value.trim();
        const answer = document.getElementById('answer').value.trim();
        
        if (!keywords || !answer) {
            this.showNotification('Please fill all fields', 'error');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/add_answer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keywords, answer })
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showNotification('✅ Answer added successfully!', 'success');
                this.addAnswerForm.reset();
            } else {
                this.showNotification('Failed to add answer', 'error');
            }
        } catch (error) {
            console.error('Add answer error:', error);
            this.showNotification('Server error! Check backend', 'error');
        }
    }

    async deleteQuery(index) {
        if (!confirm('Delete this invalid query?')) return;
        
        try {
            const response = await fetch(`http://localhost:5000/delete_invalid/${index}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showNotification('✅ Query deleted!', 'success');
                this.loadInvalidQueries();
            }
        } catch (error) {
            console.error('Delete error:', error);
            this.showNotification('Delete failed', 'error');
        }
    }

    logout() {
        if (confirm('Logout?')) {
            this.isLoggedIn = false;
            this.loginModal.style.display = 'flex';
            this.adminDashboard.style.display = 'none';
            this.loginForm.reset();
        }
    }

    showNotification(message, type = 'info') {
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        // Animate
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
}
// Replace EVERY fetch with this pattern:
const response = await fetch('http://localhost:5000/ENDPOINT', {
    method: 'POST/GET/DELETE',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data) // only for POST
});
// Initialize admin panel
document.addEventListener('DOMContentLoaded', () => {
    window.admin = new AdminPanel();
});