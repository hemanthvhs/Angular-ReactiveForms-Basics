import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';

import { CustomValidations } from './shared/validations/custom-validations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  signupform: FormGroup;

  constructor(private formbuilder: FormBuilder) { }

  ngOnInit() {
    this.signupform = this.formbuilder.group({
      preference: ['', [Validators.required]],
      contactdetails: this.formbuilder.group({
        email: [''],
        confirmemail: [''],
        phone: ['']
      }),
      skilldetails : this.formbuilder.array([
         this.AddSkillControl()
      ])        
    })

    this.signupform.get('preference').valueChanges.subscribe((data: string) => {
      this.onPreferenceChanged(data);
    })

    this.signupform.valueChanges.subscribe((data: any) => {
      this.logValidationMessagestoformErrors(this.signupform);
    })

  }

  AddSkillControl() : FormGroup {
    return this.formbuilder.group({
      skill : ['',Validators.required],
      exp   : ['',Validators.required],
      proficiency : ['',Validators.required]
    })
  }

  onAddSkillButtonClick() {
    (<FormArray>this.signupform.get('skilldetails')).push(this.AddSkillControl())
    
  }


  validationMessages = {
    'preference': { 'required': 'Preference is required' },
    'email': { 'required': 'Email is required',
                'emailValid': 'Email Domain should be gmail.com' },
    'confirmemail': { 'required': 'Confirm Email is required' },
    'contactdetails' : { 'emailMismatch' : 'Confirm Email is not same as Email provided'},
    'phone': { 'required': 'Phone Number is required' },
/*     'skill': { 'required': 'Skill is required' },
    'exp': { 'required': 'Experience is required' },
    'proficiency': { 'required': 'Proficiency is required' }, */
  }

  formErrors = {
    'preference': '',
    'email': '',
    'confirmemail': '',
    'contactdetails' : '',
    'phone': '',
/*     'skill': '',
    'exp': '',
    'proficiency':'' */
  }

  onPreferenceChanged(preference: string) {


    const emailControl = this.signupform.controls.contactdetails.get('email');
    const confirmemailControl = this.signupform.controls.contactdetails.get('confirmemail');
    const phoneControl = this.signupform.controls.contactdetails.get('phone');

    emailControl.patchValue('')
    confirmemailControl.patchValue('')
    phoneControl.patchValue('')
   
    console.log(emailControl)

    emailControl.markAsUntouched();
    confirmemailControl.markAsUntouched();
    phoneControl.markAsUntouched();

    emailControl.clearValidators();
    confirmemailControl.clearValidators();
    phoneControl.clearValidators();

    emailControl.updateValueAndValidity();
    confirmemailControl.updateValueAndValidity();
    phoneControl.updateValueAndValidity();

    if (preference === 'email') {
      emailControl.setValidators([Validators.required,CustomValidations.emailValidation('gmail.com')]);
      confirmemailControl.setValidators(Validators.required);
      this.signupform.get('contactdetails').setValidators(CustomValidations.confirmEmailValidation)
      emailControl.updateValueAndValidity();
      confirmemailControl.updateValueAndValidity();

    }

    if (preference === 'phone') {
      phoneControl.setValidators(Validators.required);
      phoneControl.updateValueAndValidity();
    }


  }


  logValidationMessagestoformErrors(group: FormGroup) {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      this.formErrors[key] = '';
      if (!abstractControl.valid && (abstractControl.touched || abstractControl.dirty)) {
        const messages = this.validationMessages[key]
        for (const errorkey in abstractControl.errors) {
          this.formErrors[key] += messages[errorkey] + ''
        }
      }

      if (abstractControl instanceof FormGroup) {
        this.logValidationMessagestoformErrors(abstractControl);
      }

      if(abstractControl instanceof FormArray) {
        for(const control of abstractControl.controls){
          if(control instanceof FormGroup) {
            this.logValidationMessagestoformErrors(control)
          }
        }
      }
    })
  }

  removeFormControl(index){
    (<FormArray>this.signupform.get('skilldetails')).removeAt(index)
  }
}


