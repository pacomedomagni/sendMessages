import React, {useState} from 'react'
/** assesment done by pacome domagni email pacomedomagni@gmail.com */

export default function SendTags () {
    const [recipients, updateRecipients] = useState("")
    const [qualifier, updateQualifier] = useState("")
    const [sendTo, updateSendTo] = useState("")
    const [sendType, updateSendType] = useState("")
    const [expression, updateExpression] = useState("")
    const [sent, updateSent] = useState(false)

    const handleChange = (event) => {
        const value = (event.target.value).toLowerCase()
        switch(event.target.name) {
            case "sendType":
                updateSendType(value)
                return
            case "sendTo":
                updateSendTo(value)
                return
            case "qualifier":
                updateQualifier(value)
                return
            default:
                return;
        }
    }
/** checking the validity of sendtype */
    const validateSendType = (rawSendType)=>{

        if(rawSendType ==='first name' || rawSendType === 'firstname') return 'firstname'
        if(rawSendType ==='last name' || rawSendType === 'lastname') return 'lastname'          
        if(rawSendType === 'organization' || rawSendType === 'organizationId') return 'organiationId'    
        if(rawSendType === 'tag' || rawSendType === 'tags')  return 'tags'
        
        return
    }
    /* * formating Qualifier to adapt with url*/
    const turnQualifier = (rawQualifier) => {
        switch(rawQualifier){
            case 'or':
                return '_or'
            case 'and':
                return ''
            default:
                return -1
        }

    }
    /** build the url format with our three parameters */
    const buildUrl = (rQualifier, rSendType, rSendTo) =>{
        let splitSendTo = rSendTo.split(',')
        if(splitSendTo.length === 1){
            return `search?${rSendType}=*${splitSendTo.join('')}*`
        }else{
            return `search${rQualifier}?${splitSendTo.map((result) => `${rSendType}[]=*${result.trim()}*&`).join('')}`
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        /** making sure the right inputs are enter otherwise throw an error message and return */
        if(!validateSendType(sendType)||turnQualifier(qualifier) === -1){
            updateExpression('')
            updateSent(true)
            updateRecipients('Wrong input please check and try again')
            return
        }
        let params = buildUrl(turnQualifier(qualifier), validateSendType(sendType) , sendTo )

        fetch(`https://sheetdb.io/api/v1/aka2sv6jd00dh/${params}`).then(response => response.json())
        .then(data => {
            /** convert raw data into String and format properly  */
            let StringValue = ''
            data.forEach(({firstName, lastName}) => StringValue+= firstName+' '+lastName+', ')
            if(data.length < 1){
                updateExpression('')
                updateRecipients('No user was found!')
            }else{              
                updateExpression('Sent To: ')
                updateRecipients(StringValue.slice(0 ,-2))
            }
            updateSent(true)
        }).catch(err => console.log(err))
    }

    return (
        <div>
            <form onSubmit={handleSubmit} style={{textAlign: "left"}}>
                <label style={{paddingRight: "10px"}}>
                    <div>
                        <span style={{paddingRight: "10px"}}>Send Type (Organization, First Name, Last Name, or Tags):</span>
                        <input type="text" name="sendType" onChange={handleChange}/>
                    </div>
                    <div>
                        <span style={{paddingRight: "10px", paddingTop: "20px"}}>Send To (separated by commas):</span>
                        <input type="text" name="sendTo" onChange={handleChange}/>
                    </div>
                    <div>
                        <span style={{paddingRight: "10px", paddingTop: "20px"}}>AND/OR?: </span>
                        <input type="text" name="qualifier" onChange={handleChange}/>
                    </div>
                </label>
                <input type="submit" value="Send Messages" />
            </form>
            { sent && <div>{expression} {recipients}</div> }
        </div>
    )
}