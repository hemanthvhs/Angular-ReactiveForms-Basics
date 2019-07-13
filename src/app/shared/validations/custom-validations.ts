import {AbstractControl } from "@angular/forms";

export class CustomValidations {
    static emailValidation(passeddomain : string ) {
       return  (control : AbstractControl) : ({[key : string] : any}) | null => {

            const emailid = control.value
            const domain = emailid.substring(emailid.lastIndexOf('@')+1)
          
            if(domain.toLowerCase() === passeddomain.toLowerCase()|| emailid === '') {
              return null
            }
          
            else {
              return {emailValid : true}
            }
          }
    }
    
    

      static confirmEmailValidation(group : AbstractControl):({[key : string] : any})| null {

        const emailid = group.get('email').value
        const confirmemailid = group.get('confirmemail').value

        if(emailid.toLowerCase() === confirmemailid.toLowerCase() || confirmemailid === '') {
            return null
        }
        else {
            return { emailMismatch : true}
        }
      
    }

}
