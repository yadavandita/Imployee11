import React, { useState, useEffect } from 'react';
import { Download, Calendar, IndianRupee, FileText, TrendingUp, Clock, TestTube } from 'lucide-react';

const Payroll = () => {
  const [payrollData, setPayrollData] = useState(null);
  const [payrollHistory, setPayrollHistory] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [testMode, setTestMode] = useState(true);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2];

  const testPayrollData = {
    _id: 'test123',
    month: 'January',
    year: 2025,
    basicSalary: 20000,
    hra: 15000,
    educationAllowance: 2500,
    otherAllowances: 7500,
    grossSalary: 45000,
    pfEmployee: 2400,
    pfEmployer: 2400,
    professionalTax: 200,
    incomeTax: 2250,
    leaveDeductions: 2045.45,
    totalDeductions: 6895.45,
    netSalary: 38104.55,
    totalWorkingDays: 22,
    daysPresent: 18,
    daysAbsent: 4,
    paidLeaves: 2,
    unpaidLeaves: 1,
    leaveDetails: [
      { date: new Date('2025-01-05'), type: 'CL', status: 'Approved', deducted: false },
      { date: new Date('2025-01-12'), type: 'SL', status: 'Approved', deducted: false },
      { date: new Date('2025-01-18'), type: 'EL', status: 'Rejected', deducted: true },
      { date: new Date('2025-01-25'), type: 'Absent', status: 'Absent', deducted: true }
    ],
    paymentDate: new Date('2025-01-31'),
    paymentStatus: 'Processed'
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    
    const currentMonth = months[new Date().getMonth()];
    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear.toString());

    if (testMode) {
      setPayrollData(testPayrollData);
    } else if (userData) {
      fetchPayrollHistory(userData._id);
      fetchPayrollByMonth(userData._id, currentMonth, currentYear);
    }
  }, [testMode]);

  const fetchPayrollHistory = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/payroll/history/${userId}`);
      const data = await res.json();
      if (data.success) {
        setPayrollHistory(data.payrolls);
      }
    } catch (error) {
      console.error('Error fetching payroll history:', error);
    }
  };

  const fetchPayrollByMonth = async (userId, month, year) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/payroll/${userId}/${month}/${year}`);
      const data = await res.json();
      if (data.success) {
        setPayrollData(data.payroll);
      } else {
        setPayrollData(null);
      }
    } catch (error) {
      console.error('Error fetching payroll:', error);
      setPayrollData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (e) => {
    const month = e.target.value;
    setSelectedMonth(month);
    if (!testMode && user && month && selectedYear) {
      fetchPayrollByMonth(user._id, month, selectedYear);
    }
  };

  const handleYearChange = (e) => {
    const year = e.target.value;
    setSelectedYear(year);
    if (!testMode && user && selectedMonth && year) {
      fetchPayrollByMonth(user._id, selectedMonth, year);
    }
  };

  const downloadPayslip = async (payrollId) => {
    if (testMode) {
      try {
        const res = await fetch(`http://localhost:5000/api/payroll/generate-test-pdf`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testPayrollData)
        });
        
        if (!res.ok) throw new Error('Failed to download PDF');
        
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Payslip_Demo_January_2025.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (error) {
        console.error('Error downloading test payslip:', error);
        alert('Make sure backend is running on http://localhost:5000');
      }
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/payroll/download/${payrollId}`);
      if (!res.ok) throw new Error('Failed to download PDF');
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Payslip_${selectedMonth}_${selectedYear}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading payslip:', error);
      alert('Failed to download payslip');
    }
  };

  const generatePayroll = async () => {
    if (!user || !selectedMonth || !selectedYear) return;
    
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/payroll/generate/${user._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month: selectedMonth, year: parseInt(selectedYear) })
      });
      const data = await res.json();
      if (data.success) {
        setPayrollData(data.payroll);
        fetchPayrollHistory(user._id);
        alert('Payroll generated successfully!');
      } else {
        alert(data.message || 'Failed to generate payroll');
      }
    } catch (error) {
      console.error('Error generating payroll:', error);
      alert('Failed to generate payroll');
    } finally {
      setLoading(false);
    }
  };

  const displayData = testMode ? testPayrollData : payrollData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <IndianRupee className="text-blue-600" />
                Payroll Management
                {testMode && <span className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-normal">Demo Mode</span>}
              </h1>
              <p className="text-gray-600 mt-1">
                {testMode ? 'Viewing sample data - Ready for PDF download!' : 'View and download your salary slips'}
              </p>
            </div>
            <div className="flex gap-3 items-center">
              <button onClick={() => setTestMode(!testMode)} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${testMode ? 'bg-yellow-500 text-white hover:bg-yellow-600' : 'bg-green-500 text-white hover:bg-green-600'}`}>
                <TestTube size={18} />
                {testMode ? 'Demo Mode' : 'Live Mode'}
              </button>
              <select value={selectedMonth} onChange={handleMonthChange} className="px-4 py-2 border border-gray-300 rounded-lg">
                {months.map(month => <option key={month} value={month}>{month}</option>)}
              </select>
              <select value={selectedYear} onChange={handleYearChange} className="px-4 py-2 border border-gray-300 rounded-lg">
                {years.map(year => <option key={year} value={year}>{year}</option>)}
              </select>
            </div>
          </div>
        </div>

        {testMode && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Demo Mode Active</h3>
                <p className="mt-1 text-sm text-yellow-700">
                  You are viewing sample payroll data for <strong>January 2025</strong>. Click <strong>Download Demo PDF</strong> to see a real payslip for company presentation!
                </p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading payroll data...</p>
          </div>
        ) : displayData ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Gross Salary</p>
                    <h3 className="text-3xl font-bold mt-1">₹{displayData.grossSalary.toFixed(2)}</h3>
                  </div>
                  <TrendingUp size={40} className="opacity-80" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-md p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm">Total Deductions</p>
                    <h3 className="text-3xl font-bold mt-1">₹{displayData.totalDeductions.toFixed(2)}</h3>
                  </div>
                  <IndianRupee size={40} className="opacity-80" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Net Salary</p>
                    <h3 className="text-3xl font-bold mt-1">₹{displayData.netSalary.toFixed(2)}</h3>
                  </div>
                  <FileText size={40} className="opacity-80" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="text-green-600" />Earnings
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Basic Salary</span>
                    <span className="font-semibold">₹{displayData.basicSalary.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">HRA</span>
                    <span className="font-semibold">₹{displayData.hra.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Education Allowance</span>
                    <span className="font-semibold">₹{displayData.educationAllowance.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Other Allowances</span>
                    <span className="font-semibold">₹{displayData.otherAllowances.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-3 bg-green-50 px-3 rounded mt-2">
                    <span className="font-bold text-green-700">Gross Salary</span>
                    <span className="font-bold text-green-700">₹{displayData.grossSalary.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <IndianRupee className="text-red-600" />Deductions
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Provident Fund</span>
                    <span className="font-semibold">₹{displayData.pfEmployee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Professional Tax</span>
                    <span className="font-semibold">₹{displayData.professionalTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Income Tax (TDS)</span>
                    <span className="font-semibold">₹{displayData.incomeTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Leave Deductions</span>
                    <span className="font-semibold text-red-600">₹{displayData.leaveDeductions.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-3 bg-red-50 px-3 rounded mt-2">
                    <span className="font-bold text-red-700">Total Deductions</span>
                    <span className="font-bold text-red-700">₹{displayData.totalDeductions.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Clock className="text-blue-600" />Attendance Summary
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{displayData.totalWorkingDays}</p>
                  <p className="text-sm text-gray-600">Working Days</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{displayData.daysPresent}</p>
                  <p className="text-sm text-gray-600">Days Present</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">{displayData.daysAbsent}</p>
                  <p className="text-sm text-gray-600">Days Absent</p>
                </div>
                <div className="text-center p-4 bg-emerald-50 rounded-lg">
                  <p className="text-2xl font-bold text-emerald-600">{displayData.paidLeaves}</p>
                  <p className="text-sm text-gray-600">Paid Leaves</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">{displayData.unpaidLeaves}</p>
                  <p className="text-sm text-gray-600">Unpaid Leaves</p>
                </div>
              </div>
            </div>

            {displayData.leaveDetails && displayData.leaveDetails.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Calendar className="text-blue-600" />Leave Details
                </h2>
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deduction</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {displayData.leaveDetails.map((leave, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 text-sm">{new Date(leave.date).toLocaleDateString('en-IN')}</td>
                        <td className="px-6 py-4 text-sm">{leave.type}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${leave.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {leave.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${leave.deducted ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                            {leave.deducted ? 'Deducted' : 'Paid'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Download Payslip</h3>
                  <p className="text-sm text-gray-600">
                    {testMode ? '🎯 Click to download demo PDF for company presentation!' : `Get detailed PDF salary slip for ${selectedMonth} ${selectedYear}`}
                  </p>
                </div>
                <button onClick={() => downloadPayslip(displayData._id)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl">
                  <Download size={20} />
                  {testMode ? 'Download Demo PDF' : 'Download PDF'}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FileText size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Payroll Found</h3>
            <p className="text-gray-600 mb-6">No payroll data available for {selectedMonth} {selectedYear}</p>
            <button onClick={generatePayroll} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
              Generate Payroll
            </button>
          </div>
        )}

        {!testMode && payrollHistory.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Payroll History</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {payrollHistory.map((payroll) => (
                <div key={payroll._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-800">{payroll.month} {payroll.year}</h4>
                      <p className="text-sm text-gray-600">Net: ₹{payroll.netSalary.toFixed(2)}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${payroll.paymentStatus === 'Processed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {payroll.paymentStatus}
                    </span>
                  </div>
                  <button onClick={() => downloadPayslip(payroll._id)} className="w-full mt-2 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm">
                    <Download size={16} />Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payroll;