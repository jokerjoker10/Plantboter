import React from 'react';
import { IonCard, IonCardTitle, IonList, IonItem, IonCardHeader, IonTitle, IonToolbar, IonCardContent,IonGrid,IonCol, IonRow } from '@ionic/react';
import {getLog, getLang} from '../../scripts/superStore';
import './logComponent.css'

var lang = getLang();

interface ContainerProps {
  id: string;
}

interface LogEntry {
  timestamp: string;
  type: string;
  value: Number;
}

const DisplayLog: React.FC<ContainerProps> = ({ id }) => {
  var data = getLog(id);
  data.then(function(data){
    var reversedLog = data.logs.reverse();

    var index = 0;

    function getDisplayDate(date:any){
      var data = new Date(date);
      return(
        data.getDay() + "." + 
        data.getMonth() + "." + 
        data.getFullYear() + 
        " " + 
        data.getHours() + ":" + 
        data.getMinutes() + ":" + 
        data.getSeconds())
    }

    return (
      <IonCard className="log">
        <IonCardHeader>
          <IonCardTitle>{lang.log.Log.Title}</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonList >
            <IonItem>
              <IonGrid>
                <IonRow>
                  <IonCol className="ion-align-self-start">{lang.log.Log.RowDescription.Time}</IonCol>
                  <IonCol className="ion-align-self-center">{lang.log.Log.RowDescription.Type}</IonCol>
                  <IonCol className="ion-align-self-end">{lang.log.Log.RowDescription.Data}</IonCol>
                </IonRow>
              </IonGrid>
            </IonItem>
          </IonList>
          <div className="logList" >
            <IonList >
              {reversedLog.map((entry:LogEntry) => {
                {return(<>
                  <IonItem key={index}>
                    <IonGrid>
                      <IonRow>
                        <IonCol className="ion-align-self-start">{getDisplayDate(entry.timestamp)}</IonCol>
                        <IonCol className="ion-align-self-center">{entry.type}</IonCol>
                        <IonCol className="ion-align-self-end">{entry.value}</IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonItem>
                </>); index++}
              })}
            </IonList>
          </div>
        </IonCardContent>
      </IonCard>
    );
  })
  return(<></>)
};

export default DisplayLog;