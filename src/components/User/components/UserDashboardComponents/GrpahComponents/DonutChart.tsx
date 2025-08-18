import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';
import api from '../../../../../utils/api'; 

ChartJS.register(ArcElement, Tooltip, Legend);

interface Order {
  status: 'completed' | 'pending' | 'delayed' | 'rejected';
  isdeleted?: boolean;
}

// Your existing API utility function
export const fetchAllOrders = async (page = 1, limit = 10, status = 'all', search = '', fromDate = '', toDate = '') => {
  try {
    const params = { page, limit, status, search, fromDate, toDate };
    const response = await api.get("/order/api/get-all-orders", {
      params,
      withCredentials: true,
    });
    const orders = response?.data?.data?.orders || [];
    const pagination = response?.data?.data?.pagination || {
      currentPage: 1,
      totalPages: 1,
      totalOrders: 0,
      limit: 10,
    };
    return { orders, pagination };
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};


const DonutChart: React.FC = () => {
  const [statusCounts, setStatusCounts] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getFullDataset = async () => {
      setLoading(true);
      let allOrders: Order[] = [];
      let currentPage = 1;
      let totalPages = 1;

      try {
        // Fetch the first page to get the total number of pages
        const firstResponse = await fetchAllOrders(1, 10);
        allOrders = allOrders.concat(firstResponse.orders);
        totalPages = firstResponse.pagination.totalPages;

        // Loop to fetch remaining pages
        if (totalPages > 1) {
          const fetchPromises = [];
          for (let page = 2; page <= totalPages; page++) {
            fetchPromises.push(fetchAllOrders(page, 10));
          }
          const allResponses = await Promise.all(fetchPromises);
          allResponses.forEach(response => {
            allOrders = allOrders.concat(response.orders);
          });
        }

        // Process the combined data to get status counts
        const counts = allOrders.reduce((acc, order) => {
          const status = order.isdeleted
            ? 'Deleted'
            : order.status.charAt(0).toUpperCase() + order.status.slice(1);
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {} as { [key: string]: number });

        setStatusCounts(counts);
        setLoading(false);

      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("An unexpected error occurred.");
        }
        setLoading(false);
      }
    };

    getFullDataset();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading chart data...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">Error: {error}</div>;
  }

  const chartLabels = Object.keys(statusCounts);
  const chartDataValues = Object.values(statusCounts);

  const statusColors = {
    Completed: '#4CAF50',
    Pending: '#FFEB3B',
    Delayed: '#FFA500',
    Rejected: '#F44336',
    Deleted: '#9E9E9E',
  };

  const statusHoverColors = {
    Completed: '#66BB6A',
    Pending: '#FFEE58',
    Delayed: '#FFD580',
    Rejected: '#EF5350',
    Deleted: '#BDBDBD',
  };

  const data: ChartData<'doughnut', number[], string> = {
    labels: chartLabels,
    datasets: [
      {
        label: 'PO Status',
        data: chartDataValues,
        backgroundColor: chartLabels.map(label => statusColors[label as keyof typeof statusColors]),
        hoverBackgroundColor: chartLabels.map(label => statusHoverColors[label as keyof typeof statusHoverColors]),
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#333',
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw as number || 0;
            return `${label}: ${value}`;
          },
        },
      },
    },
    cutout: '70%',
    elements: {
      arc: {
        borderWidth: 1,
      },
    },
  };

  if (Object.keys(statusCounts).length === 0) {
    return <div className="text-center p-4 text-gray-500">No data available</div>;
  }

  return (
    <div className='w-full'>
      <h3 className='text-start font-semibold'>Total PO Status Distribution</h3>
      <Doughnut style={{ width: '300px', height: '300px', margin: '0 auto' }} data={data} options={options} />
    </div>
  );
};

export default DonutChart;