/**
 * AI Relationship Manager - Frontend Application
 * Vanilla JavaScript frontend for banking relationship management
 */

const API_BASE = '/api';
let allCustomers = [];
let currentFilter = 'all';
let currentCustomer = null;

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    // Set up filter buttons
    document.querySelectorAll('.filter-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.getAttribute('data-filter');
            renderCustomersTable();
        });
    });

    // Set up search
    document.getElementById('searchInput').addEventListener('input', () => {
        renderCustomersTable();
    });

    // Load initial data
    await loadDashboard();
});

// ============================================
// Dashboard Functions
// ============================================

const showLoading = (show = true) => {
    const spinner = document.getElementById('loadingSpinner');
    if (show) {
        spinner.classList.add('active');
    } else {
        spinner.classList.remove('active');
    }
};

const showDashboard = () => {
    document.getElementById('dashboardView').classList.add('active');
    document.getElementById('detailView').classList.remove('active');
};

const showDetail = async (customerId) => {
    showLoading(true);
    try {
        const response = await fetch(`${API_BASE}/customers/${customerId}`);
        const data = await response.json();

        if (!data.success) {
            alert('Failed to load customer details');
            return;
        }

        currentCustomer = data.data;
        renderDetailView();

        document.getElementById('dashboardView').classList.remove('active');
        document.getElementById('detailView').classList.add('active');
        window.scrollTo(0, 0);
    } catch (error) {
        console.error('Error loading customer:', error);
        alert('Error loading customer details');
    } finally {
        showLoading(false);
    }
};

const loadDashboard = async () => {
    showLoading(true);
    try {
        // Load customers
        const customersRes = await fetch(`${API_BASE}/customers`);
        const customersData = await customersRes.json();
        allCustomers = customersData.data || [];

        // Load stats
        const statsRes = await fetch(`${API_BASE}/dashboard/stats`);
        const statsData = await statsRes.json();
        const stats = statsData.data;

        // Update stats display
        document.getElementById('totalCustomers').textContent = stats.stats.total_customers || 0;
        document.getElementById('highRiskCount').textContent = stats.stats.high_risk_count || 0;
        document.getElementById('mediumRiskCount').textContent = stats.stats.medium_risk_count || 0;
        document.getElementById('avgRiskScore').textContent =
            Math.round(stats.stats.avg_risk_score || 0);

        // Render top churn reasons
        renderTopReasons(stats.topReasons);

        // Render customers table
        renderCustomersTable();
    } catch (error) {
        console.error('Error loading dashboard:', error);
        alert('Error loading dashboard data');
    } finally {
        showLoading(false);
    }
};

// ============================================
// Rendering Functions
// ============================================

const renderCustomersTable = () => {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const tbody = document.getElementById('customersTableBody');
    tbody.innerHTML = '';

    let filtered = allCustomers;

    // Apply risk level filter
    if (currentFilter !== 'all') {
        filtered = filtered.filter((c) => c.risk_level === currentFilter);
    }

    // Apply search filter
    if (searchTerm) {
        filtered = filtered.filter((c) => c.name.toLowerCase().includes(searchTerm) || 
                                          c.email.toLowerCase().includes(searchTerm));
    }

    filtered.forEach((customer) => {
        const row = document.createElement('tr');
        const riskBadgeClass =
            customer.risk_level === 'HIGH'
                ? 'high'
                : customer.risk_level === 'MEDIUM'
                  ? 'medium'
                  : 'low';

        row.innerHTML = `
            <td>${escapeHtml(customer.name)}</td>
            <td>${escapeHtml(customer.email)}</td>
            <td>${formatRupees(customer.account_balance)}</td>
            <td><strong>${customer.risk_score}/100</strong></td>
            <td>
                <span class="risk-badge ${riskBadgeClass}">
                    ${customer.risk_level}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-small btn-small-view" onclick="showDetail(${customer.id})">
                        View Details
                    </button>
                </div>
            </td>
        `;

        tbody.appendChild(row);
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    No customers found
                </td>
            </tr>
        `;
    }
};

const renderTopReasons = (topReasons) => {
    const container = document.getElementById('topReasonsContainer');
    container.innerHTML = '';

    if (!topReasons || topReasons.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No data available</p>';
        return;
    }

    topReasons.slice(0, 6).forEach((reason) => {
        const card = document.createElement('div');
        card.className = 'reason-card';
        card.innerHTML = `
            <div class="reason-text">${escapeHtml(reason.reason)}</div>
            <div class="reason-count">${reason.frequency}</div>
            <div style="font-size: 0.8rem; color: var(--text-secondary);">customers affected</div>
        `;
        container.appendChild(card);
    });
};

const renderDetailView = () => {
    if (!currentCustomer || !currentCustomer.customer) {
        alert('Customer data not found');
        return;
    }

    const customer = currentCustomer.customer;
    const riskBadgeClass =
        customer.risk_level === 'HIGH'
            ? 'high'
            : customer.risk_level === 'MEDIUM'
              ? 'medium'
              : 'low';

    // Customer Info
    document.getElementById('detailCustomerName').textContent = escapeHtml(customer.name);
    document.getElementById('detailCustomerEmail').textContent = escapeHtml(customer.email);
    document.getElementById('detailCustomerPhone').textContent = customer.phone
        ? escapeHtml(customer.phone)
        : 'Not provided';
    document.getElementById('detailBalance').textContent = formatRupees(customer.account_balance);
    document.getElementById('detailRiskScore').textContent = `${customer.risk_score}/100`;
    document.getElementById('detailLastTransaction').textContent = formatDate(
        customer.last_transaction_date
    );
    document.getElementById('detailLoginFreq').textContent = `${customer.login_frequency}/week`;

    // Risk Badge
    const badge = document.getElementById('riskBadge');
    badge.className = `risk-badge detail ${riskBadgeClass}`;
    badge.textContent = customer.risk_level;

    // Risk Reasons
    const reasons = customer.risk_reasons || [];
    const reasonsList = document.getElementById('riskReasonsList');
    reasonsList.innerHTML = '';

    if (reasons.length > 0) {
        reasons.forEach((reason) => {
            const li = document.createElement('li');
            li.textContent = reason;
            reasonsList.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = 'No risk factors identified';
        reasonsList.appendChild(li);
    }

    // Recommended Action
    fetchRecommendedAction(customer.id);

    // Reset outreach section
    document.getElementById('outreachMessage').textContent = '';
    document.getElementById('generateOutreachBtn').disabled = false;
    document.getElementById('generateOutreachBtn').textContent = 'Generate Message';

    // Reset feedback status
    document.getElementById('feedbackStatus').textContent = '';
    document.getElementById('feedbackStatus').className = 'feedback-status';
};

const fetchRecommendedAction = async (customerId) => {
    try {
        const response = await fetch(`${API_BASE}/recommend-action/${customerId}`);
        const data = await response.json();

        if (!data.success) {
            return;
        }

        const action = data.data;
        const container = document.getElementById('actionDetails');
        let priorityClass = '';
        if (action.priority === 'URGENT') priorityClass = 'critical';
        else if (action.priority === 'MEDIUM') priorityClass = 'warning';

        container.innerHTML = `
            <div class="action-badge ${priorityClass}">${action.priority}</div>
            <h4>${escapeHtml(action.action)}</h4>
            <p><strong>Channel:</strong> ${escapeHtml(action.channel)}</p>
            <p><strong>Description:</strong> ${escapeHtml(action.description)}</p>
            <p><strong>Incentive:</strong> ${escapeHtml(action.incentive)}</p>
        `;
    } catch (error) {
        console.error('Error fetching recommended action:', error);
    }
};

// ============================================
// AI Outreach Functions
// ============================================

const generateOutreach = async () => {
    if (!currentCustomer || !currentCustomer.customer) {
        alert('Customer data not found');
        return;
    }

    const customerId = currentCustomer.customer.id;
    const btn = document.getElementById('generateOutreachBtn');
    const messageDiv = document.getElementById('outreachMessage');

    btn.disabled = true;
    btn.textContent = 'Generating...';
    messageDiv.textContent = 'Generating personalized outreach message...';

    try {
        const response = await fetch(`${API_BASE}/generate-outreach/${customerId}`, {
            method: 'POST',
        });

        const data = await response.json();

        if (!data.success) {
            messageDiv.textContent = 'Failed to generate message. Please try again.';
            btn.textContent = 'Generate Message';
            btn.disabled = false;
            return;
        }

        messageDiv.textContent = data.data.message;
        btn.textContent = '✓ Message Generated';
        btn.disabled = true;

        // Store interaction ID for feedback
        currentCustomer.lastInteractionId = data.data.interactionId;
    } catch (error) {
        console.error('Error generating outreach:', error);
        messageDiv.textContent = 'Error generating message. Please try again.';
        btn.textContent = 'Generate Message';
        btn.disabled = false;
    }
};

const recordFeedback = async (status, outcome) => {
    if (!currentCustomer || !currentCustomer.lastInteractionId) {
        // Try to get latest interaction for this customer
        try {
            const interactions = currentCustomer.interactions || [];
            if (interactions.length === 0) {
                alert('No interaction found. Please generate a message first.');
                return;
            }
            const latestInteraction = interactions[0];
            await submitFeedback(latestInteraction.id, status, outcome);
        } catch (error) {
            alert('Error recording feedback');
        }
        return;
    }

    await submitFeedback(currentCustomer.lastInteractionId, status, outcome);
};

const submitFeedback = async (interactionId, status, outcome) => {
    const feedbackDiv = document.getElementById('feedbackStatus');

    try {
        const response = await fetch(`${API_BASE}/feedback/${interactionId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status, outcome }),
        });

        const data = await response.json();

        if (!data.success) {
            feedbackDiv.className = 'feedback-status error';
            feedbackDiv.textContent = 'Failed to record feedback';
            return;
        }

        feedbackDiv.className = 'feedback-status success';
        feedbackDiv.textContent = `✓ Outcome recorded: ${status} → ${outcome}`;

        // Reload dashboard after 2 seconds
        setTimeout(() => {
            loadDashboard();
            showDashboard();
        }, 2000);
    } catch (error) {
        console.error('Error submitting feedback:', error);
        feedbackDiv.className = 'feedback-status error';
        feedbackDiv.textContent = 'Error recording feedback';
    }
};

// ============================================
// Utility Functions
// ============================================

const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(num);
};

const formatRupees = (num) => {
    return '₹' + new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(num);
};

const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const today = new Date();
    const diff = Math.floor((today - date) / (1000 * 60 * 60 * 24));

    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;
    if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
    return `${Math.floor(diff / 30)} months ago`;
};

const escapeHtml = (text) => {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
};
