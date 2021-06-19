export const LinkControl = ({
  path,
  title,
}: {
  path: string;
  title: string;
}) => {
  return (
    <div
      id='nav-link'
      className='leaflet-bar leaflet-control leaflet-control-custom'
    >
      <a href={path}>
        <i className='fas fa-info-circle'></i>
        {title}
      </a>
    </div>
  );
};
