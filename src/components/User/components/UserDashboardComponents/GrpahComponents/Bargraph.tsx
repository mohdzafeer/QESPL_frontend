import React, { useEffect, useRef, useState } from 'react';
import api from '../../../../../utils/api';
import Chart from 'chart.js/auto';

// Define the structure of your order data
interface Order {
  status: 'completed' | 'pending' | 'delayed' | 'rejected';
  isdeleted?: boolean;
  createdAt?: string;
}

interface POChartProps {
  type?: 'line' | 'bar' | 'doughnut';
  className?: string;
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

export function BarGraph({ type = 'bar', className }: POChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDataAndProcess = async () => {
      setLoading(true);
      setError(null);
      let allOrders: Order[] = [];
      let totalPages = 1;

      try {
        const firstResponse = await fetchAllOrders(1, 10);
        allOrders = allOrders.concat(firstResponse.orders);
        totalPages = firstResponse.pagination.totalPages;

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

        let processedData;
        if (type === 'doughnut') {
          const counts = allOrders.reduce((acc, order) => {
            if (order.isdeleted) {
              acc.Deleted = (acc.Deleted || 0) + 1;
            } else {
              const status = order.status.charAt(0).toUpperCase() + order.status.slice(1);
              acc[status] = (acc[status] || 0) + 1;
            }
            return acc;
          }, {} as { [key: string]: number });

          processedData = {
            labels: Object.keys(counts),
            datasets: [{
              data: Object.values(counts),
              backgroundColor: ['hsl(142 76% 36%)', 'hsl(43 96% 56%)', 'hsl(33 100% 50%)', 'hsl(0 84% 60%)', 'hsl(0 0% 50%)'],
              borderWidth: 0,
              label: 'PO Status'
            }]
          };
        } else {
          const monthlyData = allOrders.reduce((acc, order) => {
            const date = new Date(order.createdAt || '');
            if (isNaN(date.getTime())) return acc;
            const month = date.toLocaleString('default', { month: 'short' });
            const status = order.status.charAt(0).toUpperCase() + order.status.slice(1);
            if (!acc[month]) {
              acc[month] = { Completed: 0, Pending: 0, Delayed: 0, Rejected: 0 };
            }
            acc[month][status] = (acc[month][status] || 0) + 1;
            return acc;
          }, {} as { [key: string]: { [key: string]: number } });
          
          const sortedMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const labels = sortedMonths.filter(month => monthlyData[month]);
          const completedData = labels.map(month => monthlyData[month]?.Completed || 0);
          const pendingData = labels.map(month => monthlyData[month]?.Pending || 0);
          const delayedData = labels.map(month => monthlyData[month]?.Delayed || 0);
          const rejectedData = labels.map(month => monthlyData[month]?.Rejected || 0);

          processedData = {
            labels,
            datasets: [
              { label: 'Completed POs', data: completedData, backgroundColor: 'hsl(142 76% 36%)', borderColor: 'hsl(142 76% 36%)', borderWidth: 2, tension: type === 'line' ? 0.4 : 0, fill: type === 'line' },
              { label: 'Pending POs', data: pendingData, backgroundColor: 'hsl(43 96% 56%)', borderColor: 'hsl(43 96% 56%)', borderWidth: 2, tension: type === 'line' ? 0.4 : 0, fill: type === 'line' },
              { label: 'Delayed POs', data: delayedData, backgroundColor: 'hsl(33, 100%, 50%)', borderColor: 'hsl(33, 100%, 50%)', borderWidth: 2, tension: type === 'line' ? 0.4 : 0, fill: type === 'line' },
              { label: 'Rejected POs', data: rejectedData, backgroundColor: 'hsl(0, 84%, 60%)', borderColor: 'hsl(0, 84%, 60%)', borderWidth: 2, tension: type === 'line' ? 0.4 : 0, fill: type === 'line' }
            ]
          };
        }
        setData(processedData);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDataAndProcess();
  }, [type]);

  useEffect(() => {
    if (!data || !chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const config = {
      type,
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom' as const,
            labels: {
              font: { size: 12 },
              padding: 15,
              usePointStyle: true
            }
          },
          tooltip: {
            backgroundColor: 'hsl(var(--popover))',
            titleColor: 'hsl(var(--popover-foreground))',
            bodyColor: 'hsl(var(--popover-foreground))',
            borderColor: 'hsl(var(--border))',
            borderWidth: 1
          }
        },
        scales: type !== 'doughnut' ? {
          y: {
            beginAtZero: true,
            grid: {
              drawBorder: false,
              color: 'hsl(var(--border))'
            },
            ticks: {
              color: 'hsl(var(--muted-foreground))'
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: 'hsl(var(--muted-foreground))'
            }
          }
        } : undefined,
        cutout: type === 'doughnut' ? '70%' : undefined
      }
    };

    chartInstance.current = new Chart(ctx, config);

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, type]);

  if (error) {
    return <div className="text-center p-4 text-red-500">Error: {error}</div>;
  }

  return (
    // The key change is here: the wrapper div has the fixed size
    // so the layout does not shift when loading is complete.
    <div className={className}>
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <p className="text-gray-500">Loading chart data...</p>
        </div>
      ) : (
        <canvas ref={chartRef} />
      )}
    </div>
  );
}

export  default BarGraph