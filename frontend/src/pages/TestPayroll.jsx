import React, { useState } from 'react';
import { Download, Calendar, IndianRupee, FileText, TrendingUp, Clock } from 'lucide-react';

const TestPayroll = () => {
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [selectedYear, setSelectedYear] = useState('2025');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2];

  // Sample Test Data
  const testPayrollData = {
    _id: 'test123',
    month: selectedMonth,
    year: parseInt(selectedYear),
    basicSalary: 20000,
    hra: 15000,
    educationAllowance: 2500,
    otherAllowances: 7500,
    grossSalary: 45000,
    pfEmployee: 2400,
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
      {
        date: new Date('2025-01-05'),
        type: 'CL',
        status: 'Approved',
        deducted: false
      },
      {
        date: new Date('2025-01-12'),
        type: 'SL',
        status: 'Approved',
        deducted: false
      },
      {
        date: new Date('2025-01-18'),
        type: 'EL',
        status: 'Rejected',
        deducted: true
      },
      {
        date: new Date('2025-01-25'),
        type: 'Absent',
        status: 'Absent',
        deducted: true
      }
    ],
    paymentDate: new Date('2025-01-31'),
    paymentStatus: 'Processed'
  };

  const downloadTestPayslip = async () => {
  try {
    const res = await fetch(`http://localhost:5000/api/payroll/download/test123`);
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
    console.error('Error:', error);
    alert('Make sure backend is running!');
  }
};

  const payrollData = testPayrollData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <IndianRupee className="text-blue-600" />
                Test Payroll Management
              </h1>
              <p className="text-gray-600 mt-1">Testing with sample data - View how your payslip will look</p>
            </div>
            <div className="flex gap-3">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Test Data Notice */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Test Mode:</strong> This is sample data for testing purposes. In production, this will fetch real data from your backend.
              </p>
            </div>
          </div>
        </div>

        {/* Salary Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Gross Salary</p>
                <h3 className="text-3xl font-bold mt-1">₹{payrollData.grossSalary.toFixed(2)}</h3>
              </div>
              <TrendingUp size={40} className="opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-md p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Total Deductions</p>
                <h3 className="text-3xl font-bold mt-1">₹{payrollData.totalDeductions.toFixed(2)}</h3>
              </div>
              <IndianRupee size={40} className="opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Net Salary</p>
                <h3 className="text-3xl font-bold mt-1">₹{payrollData.netSalary.toFixed(2)}</h3>
              </div>
              <FileText size={40} className="opacity-80" />
            </div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Earnings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="text-green-600" />
              Earnings
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Basic Salary</span>
                <span className="font-semibold">₹{payrollData.basicSalary.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">HRA</span>
                <span className="font-semibold">₹{payrollData.hra.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Education Allowance</span>
                <span className="font-semibold">₹{payrollData.educationAllowance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Other Allowances</span>
                <span className="font-semibold">₹{payrollData.otherAllowances.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-3 bg-green-50 px-3 rounded mt-2">
                <span className="font-bold text-green-700">Gross Salary</span>
                <span className="font-bold text-green-700">₹{payrollData.grossSalary.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <IndianRupee className="text-red-600" />
              Deductions
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Provident Fund (Employee)</span>
                <span className="font-semibold">₹{payrollData.pfEmployee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Professional Tax</span>
                <span className="font-semibold">₹{payrollData.professionalTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Income Tax (TDS)</span>
                <span className="font-semibold">₹{payrollData.incomeTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Leave Deductions</span>
                <span className="font-semibold text-red-600">₹{payrollData.leaveDeductions.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-3 bg-red-50 px-3 rounded mt-2">
                <span className="font-bold text-red-700">Total Deductions</span>
                <span className="font-bold text-red-700">₹{payrollData.totalDeductions.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="text-blue-600" />
            Attendance Summary
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{payrollData.totalWorkingDays}</p>
              <p className="text-sm text-gray-600">Working Days</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{payrollData.daysPresent}</p>
              <p className="text-sm text-gray-600">Days Present</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">{payrollData.daysAbsent}</p>
              <p className="text-sm text-gray-600">Days Absent</p>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <p className="text-2xl font-bold text-emerald-600">{payrollData.paidLeaves}</p>
              <p className="text-sm text-gray-600">Paid Leaves</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">{payrollData.unpaidLeaves}</p>
              <p className="text-sm text-gray-600">Unpaid Leaves</p>
            </div>
          </div>
        </div>

        {/* Leave Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="text-blue-600" />
            Leave Details (This will appear in PDF)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deduction</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payrollData.leaveDetails.map((leave, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(leave.date).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        leave.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        leave.deducted ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {leave.deducted ? 'Deducted' : 'Paid'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Download Button */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Download Test Payslip</h3>
              <p className="text-sm text-gray-600">Test the PDF download functionality for {selectedMonth} {selectedYear}</p>
              <p className="text-xs text-orange-600 mt-1">Note: In production, this will generate actual PDF from backend</p>
            </div>
            <button
              onClick={downloadTestPayslip}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-semibold"
            >
              <Download size={20} />
              Test Download
            </button>
          </div>
        </div>

        {/* Sample Data Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Sample Data Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600"><strong>Employee:</strong> Vandita (Test User)</p>
              <p className="text-gray-600"><strong>Employee ID:</strong> EMP001</p>
              <p className="text-gray-600"><strong>Department:</strong> IT</p>
              <p className="text-gray-600"><strong>Designation:</strong> Software Developer</p>
            </div>
            <div>
              <p className="text-gray-600"><strong>CTC:</strong> ₹6,00,000 / year</p>
              <p className="text-gray-600"><strong>Monthly CTC:</strong> ₹50,000</p>
              <p className="text-gray-600"><strong>Bank:</strong> HDFC Bank</p>
              <p className="text-gray-600"><strong>Payment Mode:</strong> Bank Transfer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPayroll;