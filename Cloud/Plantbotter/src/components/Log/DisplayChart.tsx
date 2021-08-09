import React from 'react';
import { IonCard, IonCardTitle, IonContent, IonHeader, IonCardHeader, IonTitle, IonToolbar, IonCardContent,IonGrid,IonCol } from '@ionic/react';
import {log, getLog, getLang} from '../../scripts/superStore';
import { Line } from 'react-chartjs-2';
import './logComponent.css'

var lang = getLang();

interface ContainerProps {
  log: log;
}

const DisplayChart: React.FC<ContainerProps> = ({ log }) => {
  var _labels: any = [];
  log.logs.forEach((element:any) => {
    var date = new Date(element.timestamp);
    _labels.push(date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds())
  });

  var _datadry: any = []; 
  var _datawater: any = [];
  log.logs.forEach((element:any) => {
    if(element.type === "value_log"){
      
      _datadry.push(element.value)
      _datawater.push(null)
    }
    else{      
      _datadry.push(null)
      _datawater.push(100)
    }
  });

  let chartData = {
    labels: _labels,
    datasets: [{
      type: 'line',
      fill: true,
      label: 'dryness',
      data: _datadry,
      backgroundColor: 'rgba(134,102,90,0.5)',
    },
    {
      type: 'bar',
      label: 'water',
      data: _datawater,
      backgroundColor: 'rgba(33,150,243,1)',
    }]
  }

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>{lang.log.Chart.Title}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <div className="chardElement">
          <Line data={chartData} type="line" height={100}></Line>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default DisplayChart;