import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import classNames from 'classnames';
import Nav from '../components/Nav';
import { ipcRenderer } from '../lib/utils';
import { defaultToast } from '../lib/toasts';
import { getLang } from '../lib/loaders';

export default function Debug() {
    const [log, setLog] = useState('');
    const appLang = getLang();

    // asking for log every 1sec
    useEffect(() => {
        ipcRenderer.sendMessage('log');
        const intervalId = setInterval(() => {
            ipcRenderer.sendMessage('log');
        }, 1000);
        // Cleanup function to clear the interval
        return () => clearInterval(intervalId);
    }, []);

    ipcRenderer.on('log', (data) => {
        let updatedData = String(data);
        updatedData = updatedData.replace(
            /([A-Z]):\\Users\\[^\\]+\\/g,
            '<DRIVE>:\\Users\\<USER>\\'
        );
        updatedData = updatedData.replace(/([A-Z]):\\/g, '<DRIVE>:\\');
        updatedData = updatedData.replace(/\/home\/[^\\]+\//, 'home/<USER>/');
        updatedData = updatedData.replace(/\\www\\[^\\]+\\/, '\\www\\<DIR>\\');
        updatedData = updatedData.replace(/\\htdocs\\[^\\]+\\/, '\\www\\<DIR>\\');
        setLog(updatedData);
    });

    const handleCopy = (e: { preventDefault: () => void }, value: any) => {
        e.preventDefault();
        navigator.clipboard.writeText(value);
        defaultToast(`${appLang?.toast?.copied}`, 'COPIED', 2000);
    };

    const handleClearLog = (e: { preventDefault: () => void }) => {
        e.preventDefault();
    };

    return (
        <>
            <Nav title={appLang?.log?.title} />
            <div className={classNames('myApp', 'normalPage', 'logPage')}>
                <div className='container'>
                    <div className={classNames('logOptions', log === '' ? 'hidden' : '')}>
                        {/*<i
                            className='material-icons'
                            onClick={(e: any) => {
                                handleClearLog(
                                    e
                                );
                            }}
                        >&#xf0ff;</i>*/}
                        <i
                            className='material-icons'
                            onClick={(e: any) => {
                                handleCopy(e, log);
                            }}
                        >
                            &#xe14d;
                        </i>
                    </div>
                    <p className={classNames(log === '' ? 'dirRight' : 'dirLeft', 'logText')}>
                        {log === '' ? appLang?.log?.desc : log}
                    </p>
                </div>
            </div>
            <Toaster position='bottom-center' reverseOrder={false} />
        </>
    );
}
