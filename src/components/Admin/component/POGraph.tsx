import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';

ChartJS.register(BarElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

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

interface POChartProps {
  type?: 'line' | 'bar';
  className?: string;
  orders: Order[];
  timeFilter: 'weekly' | 'monthly' | 'yearly';
  statusFilter: 'all' | 'pending' | 'completed' | 'delayed' | 'rejected' | 'deleted';
  startDate?: string;
  endDate?: string;
  query?: string;
}

export const POChart: React.FC<POChartProps> = ({
  type = 'bar',
  className,
  orders,
  timeFilter,
  statusFilter,
  startDate,
  endDate,
  query,
}) => {
  const chartData = useMemo(() => {
    const statusTypes = ['completed', 'pending', 'delayed', 'rejected', 'deleted'];
    const labels: string[] = [];
    const datasets = statusTypes.map((status) => ({
      label: status === 'deleted' ? 'Deleted POs' : `${status.charAt(0).toUpperCase() + status.slice(1)} POs`,
      data: [] as number[],
      backgroundColor: status === 'completed' ? 'hsl(142 76% 36%)' :
        status === 'pending' ? 'hsl(43 96% 56%)' :
          status === 'delayed' ? 'hsl(33 100% 50%)' :
            status === 'rejected' ? 'hsl(0 84% 60%)' :
              'hsl(0 0% 50%)',
      borderColor: status === 'completed' ? 'hsl(142 76% 36%)' :
        status === 'pending' ? 'hsl(43 96% 56%)' :
          status === 'delayed' ? 'hsl(33 100% 50%)' :
            status === 'rejected' ? 'hsl(0 84% 60%)' :
              'hsl(0 0% 50%)',
      borderWidth: 2,
      tension: type === 'line' ? 0.4 : 0,
      fill: type === 'line',
    }));

    // Generate labels based on time filter
    const now = new Date();
    if (timeFilter === 'weekly') {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i * 7);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      }
    } else if (timeFilter === 'monthly') {
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
      }
    } else {
      for (let i = 4; i >= 0; i--) {
        const year = now.getFullYear() - i;
        labels.push(year.toString());
      }
    }

    // Filter orders based on props
    const filteredOrders = orders.filter((order) => {
      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'deleted' ? order.isdeleted : order.status === statusFilter && !order.isdeleted);
      const matchesDate = (!startDate || new Date(order.createdAt || order.date || now) >= new Date(startDate)) &&
        (!endDate || new Date(order.createdAt || order.date || now) <= new Date(endDate));
      const matchesQuery = !query ||
        order.orderNumber?.toLowerCase().includes(query.toLowerCase()) ||
        order.companyName?.toLowerCase().includes(query.toLowerCase()) ||
        order.clientName?.toLowerCase().includes(query.toLowerCase());
      return matchesStatus && matchesDate && matchesQuery;
    });

    // Count orders for each label and status
    const counts = labels.map(() => statusTypes.map(() => 0));
    filteredOrders.forEach((order) => {
      const createdAt = new Date(order.createdAt || order.date || now);
      let index = -1;
      if (timeFilter === 'weekly') {
        const diffDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
        index = Math.floor(diffDays / 7);
      } else if (timeFilter === 'monthly') {
        const monthDiff = (now.getFullYear() * 12 + now.getMonth()) - (createdAt.getFullYear() * 12 + createdAt.getMonth());
        index = monthDiff;
      } else {
        const yearDiff = now.getFullYear() - createdAt.getFullYear();
        index = yearDiff;
      }
      if (index >= 0 && index < labels.length) {
        const statusIndex = statusTypes.indexOf(order.isdeleted ? 'deleted' : order.status);
        if (statusIndex !== -1) counts[labels.length - 1 - index][statusIndex]++;
      }
    });

    datasets.forEach((dataset, i) => {
      dataset.data = counts.map((count) => count[i]);
    });

    return { labels, datasets } as ChartData<'bar' | 'line', number[], string>;
  }, [orders, timeFilter, statusFilter, startDate, endDate, query, type]);

  const options: ChartOptions<'bar' | 'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          font: { size: 12 },
          padding: 15,
          usePointStyle: true,
          color: 'hsl(var(--muted-foreground))',
        },
      },
      tooltip: {
        backgroundColor: 'hsl(var(--popover))',
        titleColor: 'hsl(var(--popover-foreground))',
        bodyColor: 'hsl(var(--popover-foreground))',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
          color: 'hsl(var(--border))',
        },
        ticks: {
          color: 'hsl(var(--muted-foreground))',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'hsl(var(--muted-foreground))',
        },
      },
    },
  };

  if (chartData.labels.length === 0) {
    return <div className="text-center p-4 text-gray-500">No data available</div>;
  }

  return (
    <div className={className}>
      {/* <h3 className="text-start font-semibold">POs Status Over Time</h3> */}
      {type === 'line' ? (
        <Line data={chartData} options={options} />
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
};

export default React.memo(POChart);

