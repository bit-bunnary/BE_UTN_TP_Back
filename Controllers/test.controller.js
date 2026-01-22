class TestController {
    get(request, response){
        response.send('Test Hecho')
    }
}

const testController = new TestController()
export default testController
