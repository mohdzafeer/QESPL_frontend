import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    Chart: any;
  }
}

interface POChartProps {
  type?: 'line' | 'bar' | 'doughnut';
  className?: string;
}

export function BarGraph({ type = 'bar', className }: POChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const config = {
      type,
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: type === 'doughnut' ? [{
          data: [70, 20, 10],
          backgroundColor: [
            'hsl(142 76% 36%)', // success
            'hsl(43 96% 56%)',  // warning
            'hsl(0 84% 60%)'    // destructive
          ],
          borderWidth: 0,
          label: 'PO Status'
        }] : [
          {
            label: 'Completed POs',
            data: [65, 59, 80, 81, 56, 55, 70],
            backgroundColor: type === 'line' ? 'hsla(142, 76%, 36%, 0.1)' : 'hsl(142 76% 36%)',
            borderColor: 'hsl(142 76% 36%)',
            borderWidth: 2,
            tension: type === 'line' ? 0.4 : 0,
            fill: type === 'line'
          },
          {
            label: 'Pending POs',
            data: [20, 25, 15, 30, 22, 18, 25],
            backgroundColor: type === 'line' ? 'hsla(43, 96%, 56%, 0.1)' : 'hsl(43 96% 56%)',
            borderColor: 'hsl(43 96% 56%)',
            borderWidth: 2,
            tension: type === 'line' ? 0.4 : 0,
            fill: type === 'line'
          },
          {
            label: 'Delayed POs',
            data: [10, 9, 4, 6, 26, 14, 20],
            backgroundColor: type === 'line' ? 'hsla(33, 100%, 50%, 0.1)' : 'hsl(33, 100%, 50%)',
            borderColor: 'hsl(33, 100%, 50%)',
            borderWidth: 2,
            tension: type === 'line' ? 0.4 : 0,
            fill: type === 'line'
          },
          {
            label: 'Rejected POs',
            data: [5, 3, 7, 4, 6, 2, 5],
            backgroundColor: type === 'line' ? 'hsla(0, 84%, 60%, 0.1)' : 'hsl(0 84% 60%)',
            borderColor: 'hsl(0 84% 60%)',
            borderWidth: 2,
            tension: type === 'line' ? 0.4 : 0,
            fill: type === 'line'
          }
        ]
      },
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

    // Load Chart.js dynamically if not already loaded
    if (typeof window.Chart === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = () => {
        chartInstance.current = new window.Chart(ctx, config);
      };
      document.head.appendChild(script);
    } else {
      chartInstance.current = new window.Chart(ctx, config);
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [type]);

  return (
    <div>
        <canvas
      ref={chartRef}
      className={className}
      
    />
    </div>
  );
}

