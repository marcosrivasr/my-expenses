import asyncio
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()

        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )

        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)

        # Open a new page in the browser context
        page = await context.new_page()

        # Interact with the page elements to simulate user flow
        # -> Navigate to http://localhost:5173
        await page.goto("http://localhost:5173", wait_until="commit", timeout=10000)
        
        # -> Click the 'Categorías' tab (index 45), enter 'Comida' into the category name input (index 3), and click 'Agregar' (index 70).
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div/header/nav/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div/main/div/section/form/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Comida')
        
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/div/main/div/section/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        
        # -> Enter 'Transporte' into the category name input (index 279) and submit the form (press Enter). After the page updates, verify that both 'Comida' and 'Transporte' are visible in the categories list, then finish the task.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div/main/div/section/form/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Transporte')
        
        # --> Assertions to verify final state
        frame = context.pages[-1]
        frame = context.pages[-1]
        await page.wait_for_timeout(1000)
        # Ensure the category list items exist by checking the two 'Eliminar' buttons
        btn1 = frame.locator('xpath=/html/body/div/main/div[1]/section[2]/ul/li[1]/button')
        await btn1.wait_for(state='visible', timeout=5000)
        btn2 = frame.locator('xpath=/html/body/div/main/div[1]/section[2]/ul/li[2]/button')
        await btn2.wait_for(state='visible', timeout=5000)
        # Get the text content of the parent <li> elements and verify the expected category names
        text1 = (await btn1.evaluate('node => node.parentElement ? node.parentElement.textContent : ""')).strip()
        text2 = (await btn2.evaluate('node => node.parentElement ? node.parentElement.textContent : ""')).strip()
        assert 'Comida' in text1 or 'Comida' in text2, f"Expected 'Comida' to appear in one of the category items. Found: {text1} | {text2}"
        assert 'Transporte' in text1 or 'Transporte' in text2, f"Expected 'Transporte' to appear in one of the category items. Found: {text1} | {text2}"
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    