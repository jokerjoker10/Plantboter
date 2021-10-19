import { IonSpinner, IonIcon, IonSlide, IonRange } from '@ionic/react';
import { checkmarkOutline, closeOutline, warningOutline } from 'ionicons/icons';


interface ContainerProps { }

const TimeSlider = ({status, slot}: any) => {
  return (
    <div slot={slot}>
        <IonRange></IonRange>
    </div>
  );
};

export default TimeSlider;