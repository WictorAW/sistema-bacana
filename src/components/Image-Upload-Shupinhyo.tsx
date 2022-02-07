import React, { useState } from 'react';
import { Box } from '@admin-bro/design-system';
import { BasePropertyProps } from 'admin-bro';


// COMPONENTE PARA FAZER UPLOAD E MOSTRAR A IMAGEM DENTRO DO FORMULÁRIO

const Edit: React.FC<BasePropertyProps> = (props) => {
  const { record } = props
  const srcImg = record.params['imagens_shupinhyo']
  const [fullScreen, setfullScreen] = useState(false)

  return (
    <Box>
      {srcImg ? 
      <a href={srcImg} target="_blank">
        <img style={{cursor:'zoom-in'}} width='150px' src={srcImg} />
      </a> : 'sem imagem'}
    </Box>
  )
};

export default Edit
