import { IonCardHeader, IonCard, IonIcon, IonText, IonItem, IonPage, IonTitle, IonToolbar, IonCardContent, IonInput, IonButton, IonLabel, IonCardSubtitle, IonCardTitle, IonImg, IonContent, useIonViewDidEnter, IonSelect, IonSkeletonText } from '@ionic/react';
import { checkmarkOutline, closeOutline, warningOutline } from 'ionicons/icons';
import './style.css';
import api from '../../../services/Api';
import { useState } from 'react';
import Loading from '../../loading';

interface ContainerProps { }

const ChangeEmail: React.FC<ContainerProps> = () => {
    const [email, set_email] = useState('');
    const [new_mail, set_new_mail] = useState('');
    const [loading, set_loading] = useState('none');
    const [error, set_error] = useState('');

    useIonViewDidEnter(() => {
        api.getUser()
            .then((user) => {
                set_email(user.data.user.email);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [])

    function handleMailChange(){
        set_loading('loading');

        api.changeEmail({email: new_mail})
        .then((response) => {
            set_loading('success');
            localStorage.clear();
            window.location.href = "auth/verifymail?m=" + new_mail;
        })
        .catch((error) => {
            set_loading('error');
            set_error(error.response.data.error.toString() || error.response.data.message || 'Unknown error')
        });
    }

    return (
        <IonCard class="user-card">
            <IonCardHeader>
                <IonCardTitle>Change Email</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                <p>
                    Current Mail: {!email ? <><IonSkeletonText animated style={{ width: "200px" }}></IonSkeletonText></> : email}
                </p>
                <p>
                    Note:
                </p>
                <p>
                    If you change your email your account gets Blocked until the new Email is Confirmed!
                </p>

                <IonItem color="warning" style={{display: error != '' ? "block" : "none"}}>
                    <p>{error}</p>
                </IonItem>

                <IonItem>
                    <IonLabel position="floating">New Mail</IonLabel>
                    <IonInput value={new_mail} onIonChange={e => set_new_mail(e.detail.value!)}></IonInput>
                </IonItem>
                <IonButton onClick={e => handleMailChange()}>Change Mail<Loading slot="end" status={loading}></Loading></IonButton>
            </IonCardContent>

        </IonCard>
    );
};

export default ChangeEmail;
