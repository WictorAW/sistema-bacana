import React, { useState } from 'react';
import { Box } from '@admin-bro/design-system';
import { BasePropertyProps } from 'admin-bro';


// COMPONENTE PARA FAZER UPLOAD E MOSTRAR A IMAGEM DENTRO DO FORMULÁRIO

const Edit: React.FC<BasePropertyProps> = (props) => {
  const { record } = props
  const srcImg = record.params['imagens_shupinhyo']
  const [fullScreen, setfullScreen] = useState(false)

  return (
    <Box onClick={ () => setfullScreen(!fullScreen)}>
      {srcImg ? fullScreen? <img src={srcImg} style={{cursor:'zoom-out',position: "absolute",
        top: '25%',
        left: '25%',
        width:'50%',
        height:'50%',
        background: 'white'}}/>: <img style={{cursor:'zoom-in'}} width='150px' src={srcImg} /> : 'sem imagem'}
    </Box>
  )
};

export default Edit
