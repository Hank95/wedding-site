const Legend = () => {
  return (
    <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-md">
      <h4 className="font-semibold mb-2">Legend</h4>
      <ul className="space-y-2">
        <li className="flex items-center">
          <img
            src="/markers/marker-icon-2x-green.png"
            alt="Wedding Venue"
            className="w-4 h-4 mr-2"
          />
          <span>Wedding Venue</span>
        </li>
        <li className="flex items-center">
          <img
            src="/markers/marker-icon-2x-blue.png"
            alt="Restaurant"
            className="w-4 h-4 mr-2"
          />
          <span>Restaurant</span>
        </li>
        <li className="flex items-center">
          <img
            src="/markers/marker-icon-2x-red.png"
            alt="Hotel"
            className="w-4 h-4 mr-2"
          />
          <span>Hotel</span>
        </li>
      </ul>
    </div>
  );
};

export default Legend;
