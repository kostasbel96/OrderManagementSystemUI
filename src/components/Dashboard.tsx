import { useTranslation } from 'react-i18next';

const Dashboard = () => {
    const { t } = useTranslation();

    return(
        <p>{t('nav.dashboard')}</p>
    )

}

export default Dashboard;