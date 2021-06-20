interface PieChartIconProps {
  percentage: number;
}

export const PieChartIcon: React.VFC<PieChartIconProps> = ({
  percentage,
}: PieChartIconProps) => {
  return (
    <div>
      <svg
        width='60px'
        height='60px'
        viewBox='0 0 42 42'
        className='donut'
        aria-labelledby='beers-title beers-desc'
        role='img'
      >
        <circle
          className='donut-hole'
          cx='21'
          cy='21'
          r='15.91549430918954'
          fill='white'
          role='presentation'
        ></circle>
        <circle
          className='donut-ring'
          cx='21'
          cy='21'
          r='15.91549430918954'
          fill='transparent'
          stroke='#d2d3d4'
          strokeWidth='3'
          role='presentation'
        ></circle>
        <circle
          className='donut-segment'
          cx='21'
          cy='21'
          r='15.91549430918954'
          fill='transparent'
          stroke='#ce4b99'
          strokeWidth='3'
          strokeDasharray={`${percentage} ${100 - percentage}`}
          strokeDashoffset='25'
          aria-labelledby='donut-segment-1-title donut-segment-1-desc'
        ></circle>
        <g className='chart-text'>
          <text className='chart-number' fontSize={10} x='18%' y='60%'>
            {percentage}%
          </text>
        </g>
      </svg>
    </div>
  );
};
