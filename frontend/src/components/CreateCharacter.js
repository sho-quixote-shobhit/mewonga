import React, { useState } from 'react';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner';

const CreateCharacter = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const create = async () => {
    setLoading(true);
    const response = await axios.get('http://localhost:5000/other/create');
    setImage(response.data.character);
    setLoading(false);
  };

  const handleDownload = () => {
    if (image) {
      const link = document.createElement('a');
      link.href = `data:image/jpeg;base64,${image}`;
      link.download = 'character.jpg';
      link.click();
    }
  };

  return (
    <div className='container d-flex flex-column justify-content-center align-items-center'>
      <div className='d-flex align-items-center mt-5 p-2'>
        {!loading && <button className='btn btn-light text-center fw-bold' style={{borderRadius : "30px" , color : "black"}} onClick={create}>Create Character</button>}
        {loading && (
          <div style={{ marginLeft: '10px' }}>
            <TailSpin type="TailSpin" color="#007BFF" height={30} width={30} />
          </div>
        )}
      </div>

      {image && (
        <div className='d-flex flex-column justify-content-center align-items-center'>
          <img src={`data:image/jpeg;base64,${image}`} className='my-4' alt="" />
          <button className='btn btn-light fw-bold' style={{borderRadius : "30px" , color : "black"}} onClick={handleDownload}>Download</button>
        </div>
      )}
    </div>
  );
};

export default CreateCharacter;
