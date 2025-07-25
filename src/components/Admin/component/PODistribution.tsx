import React, { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Order {
  _id: string;
  orderNumber?: string;
  generatedBy?: { name?: string; employeeId?: string; user?: { username: string } };
  formGeneratedBy?: string;
  companyName?: string;
  clientName?: string;
  createdAt?: string;
  date?: string;
  status: 'pending' | 'completed' | 'delayed' | 'rejected';
  isdeleted?: boolean;
}

interface DonutChartProps {
  className?: string;
  orders: Order[];
  statusFilter: 'all' | 'pending' | 'completed' | 'delayed' | 'rejected' | 'deleted';
  startDate?: string;
  endDate?: string;
  query?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  className,
  orders,
  statusFilter,
  startDate,
  endDate,
  query,
}) => {
  
  const chartData = useMemo(() => {
    const statusTypes = ['completed', 'pending', 'delayed', 'rejected', 'deleted'];
    const filteredOrders = orders.filter((order) => {
      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'deleted' ? order.isdeleted : order.status === statusFilter && !order.isdeleted);
      const matchesDate = (!startDate || new Date(order.createdAt || order.date || new Date()) >= new Date(startDate)) &&
        (!endDate || new Date(order.createdAt || order.date || new Date()) <= new Date(endDate));
      const matchesQuery = !query ||
        order.orderNumber?.toLowerCase().includes(query.toLowerCase()) ||
        order.companyName?.toLowerCase().includes(query.toLowerCase()) ||
        order.clientName?.toLowerCase().includes(query.toLowerCase());
      return matchesStatus && matchesDate && matchesQuery;
    });

    const counts = statusTypes.map((status) =>
      status === 'deleted'
        ? filteredOrders.filter((order) => order.isdeleted).length
        : filteredOrders.filter((order) => order.status === status && !order.isdeleted).length
    );

    return {
      labels: ['Completed', 'Pending', 'Delayed', 'Rejected', 'Deleted'],
      datasets: [{
        label: 'PO Status',
        data: counts,
        backgroundColor: [
          'hsl(142 76% 36%)', // Completed
          'hsl(43 96% 56%)',  // Pending
          'hsl(33 100% 50%)', // Delayed
          'hsl(0 84% 60%)',   // Rejected
          'hsl(0 0% 50%)',    // Deleted
        ],
        hoverBackgroundColor: [
          'hsl(142 76% 46%)',
          'hsl(43 96% 66%)',
          'hsl(33 100% 60%)',
          'hsl(0 84% 70%)',
          'hsl(0 0% 60%)',
        ],
        borderWidth: 1,
      }],
    } as ChartData<'doughnut', number[], string>;
  }, [orders, statusFilter, startDate, endDate, query]);

  // Determine text color based on dark mode class on the document body
  const isDarkMode = document.documentElement.classList.contains('dark');
  const textColor = isDarkMode ? 'white' : '#333'; // Using '#333' for a soft black in light mode

  const options: ChartOptions<'doughnut'> = {
    responsive: false,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: textColor, // Use the dynamic color here
          font: { size: 14 },
          padding: 15,
          usePointStyle: true,
        },
      },
      tooltip: {
        // You can also use the dynamic color for the tooltip text
        titleColor: textColor,
        bodyColor: textColor,
        backgroundColor: isDarkMode ? 'rgba(51, 51, 51, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        borderColor: isDarkMode ? '#444' : '#ccc',
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}`;
          },
        },
      },
    },
    cutout: '70%',
    elements: {
      arc: { borderWidth: 1 },
    },
  };

  if (chartData.datasets[0].data.every((count) => count === 0)) {
    return <div className="text-center p-4 text-gray-500 dark:text-white">No data available</div>;
  }

  return (
    <div className='w-full flex flex-col items-center'>
      {/* <h3 className="text-start font-semibold mb-2">POs Status Distribution</h3> */}
      <Doughnut width={300} height={300} data={chartData} options={options} />
    </div>
  );
};

export default React.memo(DonutChart);