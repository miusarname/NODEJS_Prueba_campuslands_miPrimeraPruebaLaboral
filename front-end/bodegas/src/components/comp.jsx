import { useEffect, useState } from 'react';
import axios from 'axios';

const BodegasList = () => {
  const [bodegas, setBodegas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3002/bodegas');
        setBodegas(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  // Sort the bodegas array alphabetically by name
  const sortedBodegas = bodegas.sort((a, b) => a.nombre.localeCompare(b.nombre));

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden sm:rounded-lg">
          <div className="bg-white border border-gray-200 overflow-hidden sm:rounded-lg">
            <dl>
              {sortedBodegas.map((bodega) => (
                <div key={bodega.id} className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">ID: {bodega.id}</dt>
                  <dd className="mt-1 text-lg font-semibold text-gray-900">{bodega.nombre}</dd>
                  <dd className="mt-1 text-sm text-gray-500">Responsible: {bodega.responsible_id}</dd>
                  <dd className="mt-1 text-sm text-gray-500">State: {bodega.state}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodegasList;




