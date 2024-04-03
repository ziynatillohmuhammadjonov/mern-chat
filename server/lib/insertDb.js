const {Message }=require('../models/message')

 function addMessageDb(data){
    Message.countDocuments().then(async count=>{
        if(count>=50){
            Message.findOneAndDelete({}, {sort:{createDateTime:-1}}).then(()=>{
                async(err, deleteDoc)=>{
                    if(err){
                        console.error(err)
                    }else{
                        console.log('Oxirgi hujjat oxhirildi. '+deleteDoc)
                        // Yangi hujat qo'shamiz
                        const message = new Message(data)
                        await message.save()
                    }
            }}).catch(err=>{
                console.log(err)
            })
        }else{
           // Yangi hujat qo'shamiz
           const message = new Message(data)
           await message.save() 
        }
    }).catch(err=>{
        console.error(err)
    })

}
module.exports = addMessageDb