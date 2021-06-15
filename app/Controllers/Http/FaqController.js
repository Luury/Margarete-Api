'use strict'

const Faq = use('App/Models/Faq');
class FaqController {

    async index({req,res}){

        const questions = await Faq.all();
        return questions
    }
}

module.exports = FaqController
