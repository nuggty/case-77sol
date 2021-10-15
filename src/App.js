import axios from "axios";
import { useEffect, useState } from "react";
import ReactHtmlParser from 'react-html-parser'
import { styled } from '@mui/material/styles';
import { Container, CssBaseline, Grid } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Image from "mui-image";

function App() {

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [localizacao, setLocalizacao] = useState([])

  useEffect(() => {
    axios.get(`https://api2.77sol.com.br/busca-cep?estrutura=fibrocimento-metalico&valor_conta=2900&cep=06543-001`)
      .then(res => {
        console.log(res.data)
        setData(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
      })
    const cep = '06543-001'
    axios.get(`http://viacep.com.br/ws/${cep}/json/`)
    .then(res => {
      console.log(res.data)
      setLocalizacao(res.data)
    })

  }, [])

  const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  }));

  return (
    <>
      {loading ? 
      <Container style={{
        textAlign: 'center',
        color: "#fff"
      }}>
        <h1><i className="fas fa-spinner fa-spin"></i></h1>
        <h1>Carregando</h1>
      </Container>
        :
        <>
          <CssBaseline />
          <Container style={{ paddingTop: '5em' }} fixed>
            <Paper style={{ marginBottom: 20, padding: 20, backgroundColor: '#EAEEF3' }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Item style={{fontSize: 16}}>
                    Tipo de estrutura: Fibrocimento Metálico <br /> <br />
                    Localização: {`${localizacao.logradouro}, ${localizacao.bairro}, ${localizacao.localidade}, ${localizacao.uf}, ${localizacao.cep}`}
                  </Item>
                </Grid>
                <Grid item xs={3}>
                  <Item>CO2: {data.co2.toFixed(2)} <br />
                    Economia: {data.economia.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </Item>
                </Grid>
                <Grid item xs={3}>
                  <Item>
                    Intregadores da região: {data.integradores_regiao} <br />
                    Mínimo de integradores: {data.integradores_minimo} <br />
                    Máximo de integradores: {data.integradores_maximo}
                  </Item>
                </Grid>
                <Grid item xs={3}>
                  <Item>
                    Irradiância: {data?.irradiancia} <br />
                    Irradiância mínima: {data?.irradiancia_minima} <br />
                    Irradiância máxima: {data?.irradiancia_maxima}
                  </Item>
                </Grid>
              </Grid>

              <TableContainer component={Paper} style={{ marginBottom: 20, marginTop: 20 }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Parcelas</TableCell>
                      <TableCell>Taxa mínima</TableCell>
                      <TableCell>Taxa máxima</TableCell>
                      <TableCell>Valor mínimo</TableCell>
                      <TableCell>Valor máximo</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.parcelamento.map((parcelamento, index) => (
                      <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell>
                          {parcelamento.parcelas}
                        </TableCell>
                        <TableCell>{parcelamento.taxa_minina + '%'}</TableCell>
                        <TableCell>{parcelamento.taxa_maxima + '%'}</TableCell>
                        <TableCell>{parcelamento.valor_minimo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                        <TableCell>{parcelamento.valor_maximo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {data.kit.map((kit, index) => (
                <Accordion key={index}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography style={{ fontSize: 17 }}>{kit.titulo}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <hr />
                    <Typography>
                      <br />
                      Custa: {kit.custo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} <br /> <br />
                      Valor: {kit.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} <br />
                      <span style={{ color: 'green' }}>Estimativa de entrega</span>: {kit.estimativaEntrega !== null ? `${kit.estimativaEntrega} dias` : "Não há estimativa de entrega"} <br />
                      Potência do módulo: {kit.potenciaModulo} Watts  <br />
                      Ficha de dados: {kit.datasheet !== '' ? <a href={kit.datasheet} target="_blank">Clique aqui</a> : "Não há ficha"}  <br />  <br />
                      Quantidade: {kit.qtde} unidades  <br />
                      Garantia: {kit.garantia !== null ? `${kit.garantia} anos` : "Não há garantia"} <br />
                      <br />
                    </Typography>
                    <Typography>
                      Descrição do produto:  <br /> <br />
                      {kit.descricao.length > 20 ? ReactHtmlParser(kit.descricao) : ''}
                    </Typography>
                    <Typography>
                      <Image
                        src={kit?.url}
                        align="right"
                        minWidth="500px"
                        alt={kit.titulo}
                        fit="cover"
                        errorIcon={true}
                        shift={null}
                        shiftDuration={
                          900
                        }
                        bgColor="inherit"
                      />
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}

            </Paper>
          </Container>
        </>
      }
    </>
  )
}

export default App;
