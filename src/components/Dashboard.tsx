// my-dashboard-component.jsx
import { ApiClient } from 'admin-bro'
import { Box, Button } from '@admin-bro/design-system'
import { useHistory } from 'react-router-dom';

const api = new ApiClient()

const Dashboard = () => {
  const history = useHistory();

  return (
    <Box 
      variant="grey"
      flex
      justifyContent="center"
      alignItems="center">
      <Box 
        variant="white"
        flex
        justifyContent="space-evenly"
        alignItems="center"
        width="90%"
        height="90%"
        flexWrap="wrap">
          <Box
            flex
            justifyContent="center"
            alignItems="center"
            width="100%">
            <img style={{width: "200px"}} src="http://localhost:5500/uploads/BACANAS-GARAGE-LOGO236.PNG" />
          </Box>
        <Button onClick={() => history.push("admin/resources/car")} size="lg" label="Carros"/>
        <Button onClick={() => history.push("admin/resources/User")} size="lg" label="Usuários"/>
      </Box>
    </Box>
  )
}

export default Dashboard
