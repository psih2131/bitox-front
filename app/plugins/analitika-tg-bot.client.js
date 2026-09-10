

export default defineNuxtPlugin((nuxtApp) => {
    const router = useRouter()
    const urlApi = useRuntimeConfig().public.apiUrl

    const utmData = router.currentRoute.value.query
    let currentUrl = `${urlApi}${router.currentRoute.value.fullPath}`
    let referrer = null

    console.log('utmData', utmData)

    router.afterEach((to, from) => {
        console.log('analitika-tg-bot', to, from)
        console.log('utmData', utmData)
        currentUrl = `${urlApi}${to.path}`
        console.log('currentUrl', currentUrl)

        console.log(document.cookie)
        console.log(useCookie('_ym_uid').value)

        referrer = `${urlApi}${from.fullPath}`
    })

    function createToken() {
        return crypto.randomUUID().replaceAll('-', '')
    }

    async function getTgBotName() {
        try {
            const response = await fetch(`${urlApi}/api/global-info`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })
            const data = await response.json()
            console.log('data', data)
            return data.data.telegram_bot_user_name
        } catch (error) {
            console.log('error', error)
            return null
        }
    }
    
    // TODO: add token to the request
    async function trackEvent() {

        const objectData = {
            utm_sourse: utmData.utm_source || 'direct',
            utm_medium: utmData.utm_medium || null,
            utm_campaign: utmData.utm_campaign || null,
            utm_content: utmData.utm_content || null,
            utm_term: utmData.utm_term || null,
            yclid: utmData.yclid || null,
            ym_client_id: useCookie('_ym_uid').value || null,
            landing_url: currentUrl || null,
            referrer: referrer || null,
            token: createToken(),
        }
        console.log('objectData', objectData)
        

        try {
            const response = await fetch(`${urlApi}/api/lead-analytics`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify( { data: objectData }),
            })
            const data = await response.json()
            console.log('data', data)

            return {
                success: true,
                data: {
                    token: data.data.token,
                    tgBotName: await getTgBotName(),
                    link: `https://t.me/${await getTgBotName()}?start=${data.data.token}`,
                }
            }


        } catch (error) {
            console.log('error', error)
            return {
                success: false,
                data: {
                    token: null,
                    tgBotName: await getTgBotName(),
                    link: `https://t.me/${await getTgBotName()}`,
                }
            }
        }
    }

    return {
        provide: {
            TgAnalitika: { trackEvent }
        }
    }
})
