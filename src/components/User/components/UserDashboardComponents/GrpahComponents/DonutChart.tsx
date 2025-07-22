import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import type { ChartOptions } from 'chart.js';
import type { ChartData } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChart: React.FC = () => {
  const statusCounts = {
    Completed: 25,
    Pending: 13,
    Delayed:10,
    Rejected: 2,
  };

  const data: ChartData<'doughnut', number[], string> = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: 'PO Status',
        data: Object.values(statusCounts),
        backgroundColor: ['#4CAF50', '#FFEB3B','#FFA500', '#F44336'],
        hoverBackgroundColor: ['#66BB6A', '#FFEE58','#FFD580', '#EF5350'],
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
            const value = context.raw || 0;
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

  return (
    <div className='w-full'>
      <h3 className='text-start  font-semibold'>POs Status Distribution</h3>
      <Doughnut style={{ width: '300px', height:'300px', margin: '0 auto' }} data={data} options={options} />
    </div>
  );
};

export default DonutChart;
